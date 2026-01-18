import { Router } from "express";
import ExpenseController from "../controllers/expense.controller.js";
import db from "../infra/db/postgres.js";
import redis from "../infra/redis/redis.js";
import { asyncHandler } from "../middlewares/async-handler.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import BudgetRepository from "../repositories/budget.repository.js";
import CategoryRepository from "../repositories/category.repository.js";
import ExpenseRepository from "../repositories/expense.repository.js";
import UserRepository from "../repositories/user.repository.js";
import ExpenseService from "../services/expense.service.js";
import { createExpenseSchema, getExpensesSchema } from "../validators/expense.schema.js";

const router: Router = Router();

const userRepo = new UserRepository();
const budgetRepo = new BudgetRepository();
const expenseRepo = new ExpenseRepository();
const catRepo = new CategoryRepository();
const expenseService = new ExpenseService(expenseRepo, catRepo, userRepo, budgetRepo, db, redis);
const expenseController = new ExpenseController(expenseService);

router.post(
  "/",
  requireAuth(userRepo, db),
  validate(createExpenseSchema),
  asyncHandler(expenseController.create)
);

router.get(
  "/",
  requireAuth(userRepo, db),
  validate(getExpensesSchema),
  asyncHandler(expenseController.get)
);

export default router;
