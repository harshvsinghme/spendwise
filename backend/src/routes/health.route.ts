import { Router } from "express";
import { asyncHandler } from "../middlewares/async-handler.js";

const router: Router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json({
      status: "ok",
      uptime: process.uptime(),
    });
  })
);

export default router;
