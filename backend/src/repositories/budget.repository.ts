import type { PoolClient } from "pg";

export default class BudgetRepository {
  constructor() {}

  async createMyBudget(
    client: PoolClient,
    data: { monthlyLimit: number; month: number; year: number }
  ) {
    const { rows } = await client.query(
      `
       INSERT INTO budgets (user_id, monthly_limit, month, year)
      VALUES (current_setting('app.user_id')::int, $1, $2, $3)
      RETURNING id, monthly_limit, month, year
      `,
      [data.monthlyLimit, data.month, data.year]
    );
    return rows[0];
  }

  async getMyBudget(client: PoolClient, data: { month: number; year: number }) {
    const { rows } = await client.query(
      `SELECT * FROM budgets WHERE user_id = current_setting('app.user_id')::int AND month = $1 AND year = $2`,
      [data.month, data.year]
    );
    return rows[0];
  }
}
