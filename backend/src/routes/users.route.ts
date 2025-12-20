import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import pool from "../infra/db/postgres.js";
import redis from "../infra/redis/redis.js";
import { UserRepository } from "../repositories/user.repository.js";
import { UserService } from "../services/user.service.js";

const router: Router = Router();

// Manual dependency wiring (simple & explicit)
// Redis belongs in services, not controllers.
const userRepo = new UserRepository(pool);
const userService = new UserService(userRepo, redis);
const userController = new UserController(userService);

router.get("/", userController.list);
router.post("/", userController.create);

export default router;
