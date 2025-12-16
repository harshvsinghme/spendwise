import { Redis } from "ioredis";
import logger from "./logger.js";

const redis = new Redis(process.env["REDIS_URL"]!, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: true,
  connectTimeout: 5_000,
});

redis.on("connect", () => {
  logger.info("Redis connecting...");
});

redis.on("ready", () => {
  logger.info("Redis ready");
});

redis.on("error", (err: unknown) => {
  logger.error(err, "Redis error");
});

redis.on("close", () => {
  logger.warn("Redis connection closed");
});

export default redis;
