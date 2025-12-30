import pino from "pino";
import { validateEnvVars } from "../../config/env.js";

validateEnvVars();

const logger = pino({
  level: process.env["LOG_LEVEL"]!,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  },
});

logger.info(`Logger initialized at level: ${process.env["LOG_LEVEL"]}`);

export default logger;
