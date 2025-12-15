import express from "express";
import { pinoHttp } from "pino-http";
import pool from "./lib/db.js";
import logger from "./lib/logger.js";

const app = express();

app.use(pinoHttp({ logger: logger }));

setTimeout(async () => {
  try {
    const { rows } = await pool.query("SELECT * FROM users");

    console.log(rows);
  } catch (error) {
    logger.error(error);
  }
}, 2000);

app.listen(process.env["PORT"], async () => {
  logger.info(`Server is running on port ${process.env["PORT"]}`);
});
