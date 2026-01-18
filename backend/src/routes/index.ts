import { Router } from "express";
import authRouter from "./auth.route.js";
import budgetRouter from "./budget.route.js";
import categoryRouter from "./category.route.js";
import expenseRouter from "./expense.route.js";
import healthRouter from "./health.route.js";

const router: Router = Router();

router.use(`/health`, healthRouter);
router.use("/auth", authRouter);

router.use("/budget", budgetRouter);
router.use("/category", categoryRouter);
router.use("/expense", expenseRouter);

export default router;
