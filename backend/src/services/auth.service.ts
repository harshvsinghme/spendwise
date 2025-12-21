import { StatusCodes } from "http-status-codes";
import type { Redis } from "ioredis";
import AppError from "../errors/app-error.js";
import type UserRepository from "../repositories/user.repository.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";

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

    const REFRESH_TTL = 60 * 60 * 24 * 30;

    await this.redis
      .multi()
      .set(`refresh:${refreshToken}`, user.id, "EX", REFRESH_TTL)
      .sadd(`user:sessions:${user.id}`, refreshToken)
      .expire(`user:sessions:${user.id}`, REFRESH_TTL)
      .exec();

    return { user, accessToken, refreshToken };
  }

  async login(data: { email: string; password: string }) {
    const user = await this.userRepo.findByEmail(data.email);

    if (!user) {
      throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
    }

    const ok = await comparePassword(data.password, user.password_hash);
    if (!ok) {
      throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
    }

    const accessToken = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    const REFRESH_TTL = 60 * 60 * 24 * 30;

    await this.redis
      .multi()
      .set(`refresh:${refreshToken}`, user.id, "EX", REFRESH_TTL)
      .sadd(`user:sessions:${user.id}`, refreshToken)
      .expire(`user:sessions:${user.id}`, REFRESH_TTL)
      .exec();

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      accessToken,
      refreshToken,
    };
  }
}
