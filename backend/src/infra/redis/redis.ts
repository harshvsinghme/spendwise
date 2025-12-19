import dayjs from "dayjs";
import { Redis } from "ioredis";
import logger from "../logger/logger.js";

const redis = new Redis(process.env["REDIS_URL"]!, { enableReadyCheck: true });

redis.on("connect", () => {
  logger.info("Redis connecting...");
});

redis.on("ready", () => {
  logger.info("Redis connected");
});

redis.on("error", (err: unknown) => {
  logger.fatal({ err }, "Redis error");
});

redis.on("close", () => {
  logger.warn("Redis connection closed");
});

export async function checkRedis() {
  const start = dayjs();

  try {
    if (redis.status !== "ready") {
      redis.disconnect();
      await redis.connect();
      throw new Error("Reconnecting, Please try again");
    }
    const pong = await redis.ping();
    if (pong !== "PONG") {
      throw new Error("Redis ping failed");
    }

    return {
      status: "up",
      latencyMs: dayjs().diff(start),
    };
  } catch (error) {
    return {
      status: "down",
      error: (error as Error).message || "Unknown issue",
    };
  }
}
export default redis;
