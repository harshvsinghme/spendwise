import cors from "cors";
import express, { type Request, type Response } from "express";
import { isLocal } from "./constants/index.js";
import pool from "./lib/db.js";
import { httpLogger } from "./lib/http-logger.js";
import logger from "./lib/logger.js";
import { asyncHandler } from "./middlewares/async-handler.js";
import errorHandler from "./middlewares/error-handler.js";
import { notFound } from "./middlewares/not-found.js";
import router from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: isLocal ? "http://localhost:3000" : ["https://mydomain.com"],
    credentials: true,
  })
);

app.use(express.json());
app.use(httpLogger);

app.get(
  "/users",
  asyncHandler(async (_req: Request, res: Response) => {
    const { rows } = await pool.query("SELECT * FROM users");

    res.json({ data: rows });
  })
);

app.use("/", router);

app.use(notFound);
app.use(errorHandler);

app.listen(process.env["PORT"], async () => {
  logger.info(`Server is running on port ${process.env["PORT"]}`);
});

process.on("unhandledRejection", (reason) => {
  logger.fatal(reason, "Unhandled promise rejection");
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  logger.fatal(err, "Uncaught exception");
  process.exit(1);
});
