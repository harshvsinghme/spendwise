import express from "express";
import { pinoHttp } from "pino-http";
import logger from "./lib/logger.js";

const app = express();

app.use(pinoHttp({ logger: logger }));

const PORT = process.env["PORT"] ?? 4000;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
