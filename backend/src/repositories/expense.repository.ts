import type { PoolClient } from "pg";

export default class ExpenseRepository {
  constructor() {}

  async create(
    client: PoolClient,
    data: { amount: number; categoryId: number; note: string; expenseDate: string }
  ) {
    const { rows } = await client.query(
      `
      INSERT INTO expenses (user_id, amount, category_id, note, expense_date)
      VALUES (current_setting('app.user_id')::int, $1, $2, $3, $4)
      RETURNING id
      `,
      [data.amount, data.categoryId, data.note, data.expenseDate]
    );
    return rows[0];
  }

  async get(client: PoolClient, _filters: object) {
    const { rows } = await client.query(
      `
      SELECT id, amount, category_id, note, expense_date, created_at FROM expenses ORDER BY id DESC
      `
    );
    return rows;
  }

  async sumOfMonth(
    client: PoolClient,
    data: { month: number; year: number }
  ): Promise<undefined | number> {
    const { rows } = await client.query(
      `
      SELECT COALESCE(SUM(amount), 0)::numeric AS total
      FROM expenses
      WHERE expense_date >= make_date($2, $1 + 1, 1)
        AND expense_date <  (make_date($2, $1 + 1, 1) + INTERVAL '1 month')
      `,
      [data.month, data.year]
    );

    return Number(rows[0].total);
  }
}
