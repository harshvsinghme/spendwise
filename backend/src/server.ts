import createApp from "./app.js";
import logger from "./infra/logger/logger.js";
import attachBudgetWorker from "./infra/redis/bullmq/workers/budget.worker.js";

const app = createApp();

app.listen(process.env["PORT"], async () => {
  logger.info(`Server is running on port ${process.env["PORT"]}`);
});

attachBudgetWorker();

process.on("unhandledRejection", (reason) => {
  logger.fatal(reason, "Unhandled promise rejection");
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  logger.fatal(err, "Uncaught exception");
  process.exit(1);
});
