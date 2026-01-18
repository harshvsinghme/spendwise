import type { PoolClient } from "pg";

export default class UserRepository {
  constructor() {}
  async create(
    client: PoolClient,
    data: { name: string; email: string; password_hash: string; currency: string }
  ) {
    const { rows } = await client.query(
      `
      INSERT INTO users (name, email, password_hash, currency)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, currency
      `,
      [data.name, data.email, data.password_hash, data.currency]
    );
    return rows[0];
  }

  async findByEmail(client: PoolClient, data: { email: string }) {
    const { rows } = await client.query(`SELECT * FROM users WHERE email = $1`, [data.email]);
    return rows[0];
  }

  async findById(
    client: PoolClient,
    data: { userId: number }
  ): Promise<undefined | { id: number; name: string; email: string }> {
    const { rows } = await client.query(`SELECT id, name, email FROM users WHERE id = $1`, [
      data.userId,
    ]);
    return rows[0];
  }

  async updatePassword(client: PoolClient, data: { userId: number; passwordHash: string }) {
    await client.query(`UPDATE users SET password_hash = $1 WHERE id = $2`, [
      data.passwordHash,
      data.userId,
    ]);
  }
}
