import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import pool from "../infra/db/postgres.js";
import redis from "../infra/redis/redis.js";
import { asyncHandler } from "../middlewares/async-handler.js";
import validate from "../middlewares/validate.middleware.js";
import UserRepository from "../repositories/user.repository.js";
import AuthService from "../services/auth.service.js";
import { signupSchema } from "../validators/auth.schema.js";

const router: Router = Router();

const userRepo = new UserRepository(pool);
const authService = new AuthService(userRepo, redis);
const authController = new AuthController(authService);

router.post("/signup", validate(signupSchema), asyncHandler(authController.signup));

export default router;
