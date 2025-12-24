import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { checkPostgres } from "../infra/db/postgres.js";
import { checkRedis } from "../infra/redis/redis.js";
import { asyncHandler } from "../middlewares/async-handler.js";
import { utcTime } from "../utils/time.js";

const router: Router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const checks = await Promise.allSettled([checkPostgres(), checkRedis()]);

    const postgres =
      checks[0].status === "fulfilled"
        ? checks[0].value
        : { status: "down", error: checks[0].reason.message };

    const redis =
      checks[1].status === "fulfilled"
        ? checks[1].value
        : { status: "down", error: checks[1].reason.message };

    const isHealthy = postgres.status === "up" && redis.status === "up";

    res.status(isHealthy ? StatusCodes.OK : StatusCodes.SERVICE_UNAVAILABLE).json({
      status: isHealthy ? "ok" : "degraded",
      services: {
        postgres,
        redis,
      },
      timestamp: utcTime(),
    });
  })
);

export default router;
