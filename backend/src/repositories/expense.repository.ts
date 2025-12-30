import type { Pool, PoolClient } from "pg";
import type { IExpenseDB } from "../types/expense.js";

export default class ExpenseRepository {
  constructor(private readonly pool: Pool) {}

  async findAll(client?: PoolClient): Promise<IExpenseDB[]> {
    const executor = client ?? this.pool;
    const res = await executor.query(`SELECT * FROM expenses`);
    return res.rows;
  }
}
