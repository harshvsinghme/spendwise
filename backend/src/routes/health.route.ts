import { Router } from "express";
import redis from "../lib/redis.js";
import { asyncHandler } from "../middlewares/async-handler.js";

const router: Router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json({
      status: "ok",
      uptime: process.uptime(),
      postgres: "connected",
      redis: redis.ping(),
    });
  })
);

export default router;
