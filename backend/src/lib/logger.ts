import pino from "pino";
import dotenv from "dotenv";
import { Environments } from "../constants/index.js";
import { existsSync } from "node:fs";

const path = `${process.cwd()}/.env.${
  process.env["NODE_ENV"] ?? Environments.LOCAL
}`;

if (!existsSync(path)) {
  console.error(`Environment file not found at path: ${path}`);
  process.exit(0);
}

dotenv.config({
  path,
});

console.log(
  `Using environment file: ${path}`,
  `LOG_LEVEL: ${process.env["LOG_LEVEL"] ?? `info(fallback)`}`
);

const logger = pino({
  level: process.env["LOG_LEVEL"] ?? "info",
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
