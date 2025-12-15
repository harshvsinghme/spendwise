import { Router } from "express";
import healthRouter from "./health.route.js";

const router: Router = Router();

router.use(`/health`, healthRouter);12

export default router;
