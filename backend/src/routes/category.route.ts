import { Router } from "express";
import CategoryController from "../controllers/category.controller.js";
import db from "../infra/db/postgres.js";
import redis from "../infra/redis/redis.js";
import { asyncHandler } from "../middlewares/async-handler.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import CategoryRepository from "../repositories/category.repository.js";
import UserRepository from "../repositories/user.repository.js";
import CategoryService from "../services/category.service.js";
import { createCategorySchema } from "../validators/category.schema.js";

const router: Router = Router();

const userRepo = new UserRepository();
const catRepo = new CategoryRepository();
const catService = new CategoryService(catRepo, db, redis);
const catController = new CategoryController(catService);

router.post(
  "/",
  requireAuth(userRepo, db),
  validate(createCategorySchema),
  asyncHandler(catController.create)
);

export default router;
