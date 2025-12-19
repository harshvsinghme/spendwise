import { Pool } from "pg";

export interface User {
  id: number;
  name: string;
  createdAt: Date;
}

export class UserRepository {
  constructor(private readonly pool: Pool) {}

  async findAll(): Promise<User[]> {
    const { rows } = await this.pool.query(`
      SELECT id, name, "createdAt"
      FROM users
    `);
    return rows;
  }

  async create(id:number, name: string): Promise<User> {
    const { rows } = await this.pool.query(
      `
      INSERT INTO users (id, name)
      VALUES ($1, $2)
      RETURNING id, name, "createdAt"
      `,
      [id, name]
    );
    return rows[0];
  }
}
