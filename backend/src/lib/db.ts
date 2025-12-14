import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env["DATABASE_URL"],
  application_name: "spendwise-backend",
  max: 10, // max connections
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 2_000,
});

export default pool;
