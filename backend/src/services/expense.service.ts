import type { Redis } from "ioredis";
import assert from "node:assert";
import type { DB } from "../infra/db/db.js";
import budgetQueue from "../infra/redis/bullmq/queue/budget.queue.js";
import type CategoryRepository from "../repositories/category.repository.js";
import type ExpenseRepository from "../repositories/expense.repository.js";

export default class ExpenseService {
  constructor(
    private readonly expenseRepo: ExpenseRepository,
    private readonly catRepo: CategoryRepository,
    private readonly db: DB,
    private readonly redis: Redis
  ) {}

  async create(
    userId: number,
    data: { amount: number; categoryId: number; note: string; expenseDate: Date }
  ) {
    await this.db.withUser(userId, async (client) => {
      assert(
        await this.catRepo.getById(client, {
          id: data.categoryId,
        })
      );

      this.expenseRepo.create(client, {
        amount: data.amount,
        categoryId: data.categoryId,
        note: data.note,
        expenseDate: data.expenseDate,
      });
    });

    budgetQueue.add(
      "budget-threshold-job",
      {
        userId,
        data,
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
