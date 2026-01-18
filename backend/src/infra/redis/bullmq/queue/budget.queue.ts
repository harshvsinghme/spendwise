import { Queue } from "bullmq";
import redisForBullMq from "../redis.js";

const budgetQueue = new Queue("budget-queue", {
  connection: redisForBullMq,
});

export default budgetQueue;
