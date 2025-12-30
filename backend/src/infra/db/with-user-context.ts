import type { PoolClient } from "pg";

/**
 * For TRANSACTION queries, Scoped to transaction, Automatically cleared.
 * 
 * e.g.
 * ```
 * const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await setUserContext(client, userId);

    await expenseRepo.create(data, client);
    await budgetRepo.updateSpent(data, client);

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
  ```
 */
export async function setUserContext(client: PoolClient, userId: number) {
  await client.query(`SET LOCAL app.user_id = $1`, [userId]);
}
