import dayjs from "dayjs";
import { Pool } from "pg";
import logger from "./logger.js";

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
  const start = dayjs();

  try {
    await pool.query("SELECT 1");

    return {
      status: "up",
      latencyMs: dayjs().diff(start),
    };
  } catch (error) {
    return {
      status: "down",
      error: (error as unknown as { code?: string }).code ?? "Unknown issue",
    };
  }
}

export default pool;
