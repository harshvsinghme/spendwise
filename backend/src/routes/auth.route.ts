import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import db from "../infra/db/postgres.js";
import redis from "../infra/redis/redis.js";
import { asyncHandler } from "../middlewares/async-handler.js";
import validate from "../middlewares/validate.middleware.js";
import PasswordResetRepository from "../repositories/passwordReset.repository.js";
import UserRepository from "../repositories/user.repository.js";
import AuthService from "../services/auth.service.js";
import {
  forgotPasswordSchema,
  loginSchema,
  logoutSchema,
  refreshSchema,
  resetPasswordSchema,
  signupSchema,
} from "../validators/auth.schema.js";

const router: Router = Router();

const userRepo = new UserRepository();
const passwordResetRepo = new PasswordResetRepository();
const authService = new AuthService(userRepo, passwordResetRepo, db, redis);
const authController = new AuthController(authService);

router.post("/signup", validate(signupSchema), asyncHandler(authController.signup));
router.post("/login", validate(loginSchema), asyncHandler(authController.login));
router.post("/refresh", validate(refreshSchema), asyncHandler(authController.refresh));
router.post("/logout", validate(logoutSchema), asyncHandler(authController.logout));
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  asyncHandler(authController.forgotPassword)
);
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  asyncHandler(authController.resetPassword)
);

export default router;
