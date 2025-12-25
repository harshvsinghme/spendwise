import type { Pool } from "pg";
import type { IPasswordResetsDB } from "../types/passwordResets.js";

export default class PasswordResetRepository {
  constructor(private readonly pool: Pool) {}
  async create(resetData: { token: string; user_id: number; expires_at: Date }) {
    const { rows } = await this.pool.query(
      `
      INSERT INTO password_resets (token, user_id, expires_at)
      VALUES ($1, $2, $3)
      `,
      [resetData.token, resetData.user_id, resetData.expires_at]
    );
    return rows[0];
  }

  async findByToken(token: string): Promise<IPasswordResetsDB | undefined> {
    const { rows } = await this.pool.query(`SELECT * FROM password_resets WHERE token = $1`, [
      token,
    ]);
    return rows[0];
  }
  async deleteByUserId(id: number) {
    await this.pool.query(`DELETE FROM password_resets WHERE user_id = $1`, [id]);
  }
}
