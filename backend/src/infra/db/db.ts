import { StatusCodes } from "http-status-codes";
import type { Pool, PoolClient } from "pg";
import AppError from "../../errors/app-error.js";

export class DB {
  constructor(private readonly pool: Pool) {}

  async withUser<T>(userId: number, fn: (client: PoolClient) => Promise<T>): Promise<T> {
    if (!userId || userId < 1) {
      throw new AppError("Invalid user context", StatusCodes.INTERNAL_SERVER_ERROR);
    }

    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(`SET LOCAL app.user_id = ${Number(userId)}`);

      const result = await fn(client);

      await client.query("COMMIT");
      return result;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * For public / pre-auth APIs
   */
  async withoutUser<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      return await fn(client);
    } finally {
      client.release();
    }
  }
}
