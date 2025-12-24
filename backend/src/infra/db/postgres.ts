import { Pool } from "pg";
import { utcTime } from "../../utils/time.js";
import logger from "../logger/logger.js";

const pool = new Pool({
  connectionString: process.env["DATABASE_URL"],
});

pool.on("connect", () => {
  logger.info("PostgreSQL connected");
});

pool.on("error", (err: unknown) => {
  logger.fatal({ err }, "PostgreSQL error");
});

export async function checkPostgres() {
  const start = utcTime();

  try {
    await pool.query("SELECT 1");

    return {
      status: "up",
      latencyMs: utcTime().diff(start),
    };
  } catch (error) {
    return {
      status: "down",
      error: (error as unknown as { code?: string }).code ?? "Unknown issue",
    };
  }
}

export default pool;
