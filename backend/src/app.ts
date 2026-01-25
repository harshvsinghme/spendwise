import cors from "cors";
import express from "express";
import { rateLimit } from "express-rate-limit";
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

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-8",
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  });

  app.use(limiter);

  app.use(express.json({ limit: "10kb" }));
  app.use(httpLogger);

  app.use("/", router);

  app.use(notFound);
  app.use(errorHandler);
  return app;
};

export default createApp;
