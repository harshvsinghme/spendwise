import { Router } from "express";
import authRouter from "./auth.route.js";
import healthRouter from "./health.route.js";

const router: Router = Router();

router.use(`/health`, healthRouter);

router.use("/auth", authRouter);
export default router;
