import type { Pool } from "pg";

export default class ExpenseRepository {
  constructor(private readonly pool: Pool) {}

  async findAll() {
    const res = await this.pool.query(`SELECT * FROM expenses`);
    return res.rows;
  }
}
