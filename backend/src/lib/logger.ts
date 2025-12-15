import dotenv from "dotenv";
import { existsSync } from "node:fs";
import pino from "pino";

const path = `${process.cwd()}/.env.${process.env["NODE_ENV"]}`;

if (!existsSync(path)) {
  console.error(`Environment file not found at path: ${path}`);
  process.exit(1);
}

dotenv.config({
  path,
});

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

export default logger;
