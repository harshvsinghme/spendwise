import type { PoolClient } from "pg";

export default class CategoryRepository {
  constructor() {}

  async create(client: PoolClient, data: { name: string; icon: string }) {
    const { rows } = await client.query(
      `
      INSERT INTO categories (user_id, name, icon)
      VALUES (current_setting('app.user_id')::int, $1, $2)
      RETURNING id, name, icon
      `,
      [data.name, data.icon]
    );
    return rows[0];
  }

  async get(client: PoolClient, _filters: object) {
    const { rows } = await client.query(
      `
      SELECT id, name, icon, created_at FROM categories ORDER BY id DESC
      `
    );
    return rows;
  }
}
