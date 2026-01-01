import { Router } from "express";
import BudgetController from "../controllers/budget.controller.js";
import db from "../infra/db/postgres.js";
import redis from "../infra/redis/redis.js";
import { asyncHandler } from "../middlewares/async-handler.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import BudgetRepository from "../repositories/budget.repository.js";
import UserRepository from "../repositories/user.repository.js";
import BudgetService from "../services/budget.service.js";
import { budgetSchema } from "../validators/budget.schema.js";

const router: Router = Router();

const userRepo = new UserRepository();
const budgetRepo = new BudgetRepository();
const budgetService = new BudgetService(budgetRepo, db, redis);
const budgetController = new BudgetController(budgetService);

router.post(
  "/mine",
  requireAuth(userRepo, db),
  validate(budgetSchema),
  asyncHandler(budgetController.createMyBudget)
);

export default router;
