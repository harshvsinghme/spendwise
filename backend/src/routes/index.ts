import { Router } from "express";
import healthRouter from "./health.route.js";
import usersRouter from "./users.route.js";

const router: Router = Router();

router.use(`/health`, healthRouter);
router.use(`/users`, usersRouter);
export default router;
