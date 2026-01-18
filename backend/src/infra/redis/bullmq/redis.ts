import type { ConnectionOptions } from "bullmq";
import { Redis } from "ioredis";

const redisForBullMq = new Redis(process.env["REDIS_URL"]!, {
  maxRetriesPerRequest: null,
}) as ConnectionOptions;

export default redisForBullMq;
