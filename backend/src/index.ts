import express from "express";
import { pinoHttp } from "pino-http";
import logger from "./lib/logger.js";
import pool from "./lib/db.js";

const app = express();

app.use(pinoHttp({ logger: logger }));

const PORT = process.env["PORT"] ?? 4000;

setTimeout(async () => {
  try {
    const { rows } = await pool.query("SELECT * FROM users");

    console.log(rows);
  } catch (error) {
    logger.error(error);
  }
}, 2000);

app.listen(PORT, async () => {
  logger.info(`Server is running on port ${PORT}`);
});
