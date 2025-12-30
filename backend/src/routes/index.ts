import { Router } from "express";
import { dbUserContext, releaseDbClient } from "../middlewares/db-user-context.middleware.js";
import authRouter from "./auth.route.js";
import healthRouter from "./health.route.js";

const router: Router = Router();

// public routes
router.use(`/health`, healthRouter);
router.use("/auth", authRouter);

// protected routes
// router.use(authMiddleware);
router.use(dbUserContext);
// router.use("/categories", categoriesRouter);
// router.use("/expenses", expensesRouter);
// router.use("/budgets", budgetsRouter);
router.use(releaseDbClient);

export default router;
