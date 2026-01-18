import type { PoolClient } from "pg";

export default class PasswordResetRepository {
  constructor() {}
  async create(client: PoolClient, data: { token: string; user_id: number; expires_at: Date }) {
    const { rows } = await client.query(
      `
      INSERT INTO password_resets (token, user_id, expires_at)
      VALUES ($1, $2, $3)
      `,
      [data.token, data.user_id, data.expires_at]
    );
    return rows[0];
  }

  async findByToken(client: PoolClient, data: { token: string }) {
    const { rows } = await client.query(`SELECT * FROM password_resets WHERE token = $1`, [
      data.token,
    ]);
    return rows[0];
  }
  async deleteByUserId(client: PoolClient, data: { user_id: number }) {
    await client.query(`DELETE FROM password_resets WHERE user_id = $1`, [data.user_id]);
  }
}
