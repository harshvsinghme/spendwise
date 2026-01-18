import type { Redis } from "ioredis";
import assert from "node:assert";
import type { DB } from "../infra/db/db.js";
import budgetQueue from "../infra/redis/bullmq/queue/budget.queue.js";
import type BudgetRepository from "../repositories/budget.repository.js";
import type CategoryRepository from "../repositories/category.repository.js";
import type ExpenseRepository from "../repositories/expense.repository.js";
import type UserRepository from "../repositories/user.repository.js";

export default class ExpenseService {
  constructor(
    private readonly expenseRepo: ExpenseRepository,
    private readonly catRepo: CategoryRepository,
    private readonly userRepo: UserRepository,
    private readonly budgetRepo: BudgetRepository,
    private readonly db: DB,
    private readonly redis: Redis
  ) {}

  async create(
    userId: number,
    data: { amount: number; categoryId: number; note: string; expenseDate: string }
  ) {
    await this.db.withUser(userId, async (client) => {
      assert(
        await this.catRepo.getById(client, {
          id: data.categoryId,
        })
      );

      await this.expenseRepo.create(client, {
        amount: data.amount,
        categoryId: data.categoryId,
        note: data.note,
        expenseDate: data.expenseDate,
      });

      const month = new Date(data.expenseDate).getMonth();
      const year = new Date(data.expenseDate).getFullYear();

      const total = (await this.expenseRepo.sumOfMonth(client, { month, year })) ?? 0;

      const budget = await this.budgetRepo.getMyBudget(client, { month, year });

      if (budget && total >= budget.monthly_limit * 0.8) {
        const user = await this.userRepo.findById(client, { userId });
        if (user?.email) {
          budgetQueue.add(
            "budget-warning-job",
            {
              name: user.name,
              email: user.email,
              utilisedPercentage: (total / budget.monthly_limit) * 100,
              month,
              year,
            },
            {
              attempts: 3,
              backoff: {
                type: "exponential",
                delay: 1000,
              },
              removeOnComplete: true,
            }
          );
        }
      }
    });

    const cached = await this.redis.get(`expenses:${userId}`);
    if (cached) {
      this.redis.del(`expenses:${userId}`);
    }
  }

  async get(userId: number, filters: object) {
    const cached = await this.redis.get(`expenses:${userId}`);
    if (cached) {
      return { expenses: JSON.parse(cached) };
    }
    const expenses = await this.db.withUser(userId, (client) =>
      this.expenseRepo.get(client, filters)
    );

    this.redis.set(`expenses:${userId}`, JSON.stringify(expenses), "EX", 60);
    return { expenses };
  }
}
