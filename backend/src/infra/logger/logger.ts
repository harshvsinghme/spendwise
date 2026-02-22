import pino from "pino";
import { validateEnvVars } from "../../config/env.js";

validateEnvVars();

const logger = pino({
  level: process.env["LOG_LEVEL"]!,
  redact: {
    paths: ["password", "authToken"],
    remove: true,
  },
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "UTC:yyyy-mm-dd HH:MM:ss.l o",
      ignore: "pid,hostname",
    },
  },
});

logger.info(`Logger initialized at level: ${process.env["LOG_LEVEL"]}`);

export default logger;
