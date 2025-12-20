import cors from "cors";
import express from "express";
import { isLocal } from "./constants/index.js";
import { httpLogger } from "./infra/logger/http-logger.js";
import errorHandler from "./middlewares/error-handler.js";
import { notFound } from "./middlewares/not-found.js";
import router from "./routes/index.js";

const createApp = (): express.Application => {
  const app = express();

  app.use(
    cors({
      origin: isLocal ? "http://localhost:3000" : ["https://mydomain.com"],
      credentials: true,
    })
  );

  app.use(express.json({ limit: "10kb" }));
  app.use(httpLogger);

  app.use("/", router);

  app.use(notFound);
  app.use(errorHandler);
  return app;
};

export default createApp;
