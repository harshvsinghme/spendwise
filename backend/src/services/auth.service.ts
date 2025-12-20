import { StatusCodes } from "http-status-codes";
import type { Redis } from "ioredis";
import AppError from "../errors/app-error.js";
import type UserRepository from "../repositories/user.repository.js";
import { hashPassword } from "../utils/bcrypt.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";
import { storeRefreshToken } from "../utils/tokens.js";

export default class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly redis: Redis
  ) {}

  async signup(data: { name: string; email: string; password: string }) {
    // FIXME: Remove redis ping, It's only for testing connection issues
    this.redis.ping();
    const existingUser = await this.userRepo.findByEmail(data.email);
    if (existingUser) {
      throw new AppError(`Email already in use`, StatusCodes.CONFLICT);
    }
    const hash = await hashPassword(data.password);
    const user = await this.userRepo.create({
      ...data,
      passwordHash: hash,
    });

    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    await storeRefreshToken(user.id, refreshToken);

    return { user, accessToken, refreshToken };
  }
}
