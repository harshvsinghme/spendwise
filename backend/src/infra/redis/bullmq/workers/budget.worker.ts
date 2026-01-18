import { Job, Worker } from "bullmq";
import dayjs from "dayjs";
import { cpus } from "node:os";
import { sendEmail } from "../../../email/email.service.js";
import { BUDGET_WARNING } from "../../../email/templates/budget-warning.js";
import logger from "../../../logger/logger.js";
import redisForBullMq from "../redis.js";

const attachBudgetWorker = () => {
  logger.info(`Attaching BullMQ consumer to 'budget-queue'...`);

  const worker = new Worker(
    "budget-queue",
    async (job: Job) => {
      logger.info(`Processing #${job.id}`);

      const { name, email, utilisedPercentage, month, year } = job.data as {
        name: string;
        email: string;
        utilisedPercentage: number;
        month: string;
        year: number;
      };

      sendEmail({
        template: BUDGET_WARNING,
        data: {
          name,
          utilisedPercentage: utilisedPercentage.toFixed(2),
          month: dayjs(`2026-${month + 1}-01`).format(`MMMM`),
          year,
        },
        recipients: [email],
      });
    },
    { connection: redisForBullMq, concurrency: cpus().length }
  );

  worker.on("completed", async (job, _result) => {
    logger.info(`Completed #${job.id}`);
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
