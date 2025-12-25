import type { Pool } from "pg";
import type { IUserDB } from "../types/user.js";

export default class UserRepository {
  constructor(private readonly pool: Pool) {}
  async create(user: { name: string; email: string; password_hash: string }) {
    const { rows } = await this.pool.query(
      `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, currency
      `,
      [user.name, user.email, user.password_hash]
    );
    return rows[0];
  }

  async findByEmail(email: string): Promise<IUserDB | undefined> {
    const { rows } = await this.pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    return rows[0];
  }

  async findById(id: number): Promise<IUserDB | undefined> {
    const { rows } = await this.pool.query(`SELECT id, name, email FROM users WHERE id = $1`, [id]);
    return rows[0];
  }

  async updatePassword(id: number, passwordHash: string) {
    await this.pool.query(`UPDATE users SET password_hash = $1 WHERE id = $2`, [passwordHash, id]);
  }
}
