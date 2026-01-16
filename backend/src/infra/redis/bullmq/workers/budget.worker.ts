import { Job, Worker } from "bullmq";
import { cpus } from "node:os";
import logger from "../../../logger/logger.js";
import redisForBullMq from "../redis.js";

const attachBudgetWorker = () => {
  logger.info(`Attaching BullMQ consumer to 'budget-queue'...`);

  const worker = new Worker(
    "budget-queue",
    async (job: Job) => {
      //   const { data } = job;

      logger.info(`Processing #${job.id}`);
      //   throw new Error('signalhj')

      const workerResult = { a: 10 };
      return workerResult;
    },
    { connection: redisForBullMq, concurrency: cpus().length }
  );

  worker.on("completed", async (job, result) => {
    const { data } = job;

    logger.info(`Completed #${job.id}`, data, result);
  });

  worker.on("failed", async (job, err) => {
    const { attemptsMade, opts } = job as {
      attemptsMade: number;
      opts: { attempts: number };
      data: unknown;
    };

    const isFinalAttempt = attemptsMade >= (opts.attempts || 1);

    if (!isFinalAttempt) {
      logger.info(
        `Retrying the failed job #${job?.id} - (attempted ${attemptsMade} out of ${opts.attempts} attempts)`
      );
      return;
    }

    logger.error(
      err,
      `Final failure of the job #${job?.id} - (attempted ${attemptsMade} out of ${opts.attempts} attempts)`
    );
  });
  logger.info(`Attached the consumer to Budget Queue`);
};
export default attachBudgetWorker;
