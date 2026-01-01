import type { Redis } from "ioredis";
import type { DB } from "../infra/db/db.js";
import type BudgetRepository from "../repositories/budget.repository.js";

export default class BudgetService {
  constructor(
    private readonly budgetRepo: BudgetRepository,
    private readonly db: DB,
    private readonly redis: Redis
  ) {
    // TODO: let's use redis at required place and remove from here
    this.redis.ping();
  }

  async createMyBudget(
    userId: number,
    data: { monthlyLimit: number; month: number; year: number }
  ) {
    const existingBudget = await this.db.withUser(userId, (client) =>
      this.budgetRepo.getMyBudget(client, { month: data.month, year: data.year })
    );

    if (existingBudget) {
      await this.db.withUser(userId, (client) =>
        this.budgetRepo.updateMyBudget(client, {
          id: existingBudget.id,
          monthlyLimit: data.monthlyLimit,
        })
      );
    } else {
      await this.db.withUser(userId, (client) =>
        this.budgetRepo.createMyBudget(client, {
          monthlyLimit: data.monthlyLimit,
          month: data.month,
          year: data.year,
        })
      );
    }
  }
}
