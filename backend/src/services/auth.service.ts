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

    await this.redis
      .multi()
      .set(`refresh:${refreshToken}`, user.id, "EX", Number(process.env["REFRESH_TOKEN_TTL"]))
      .sadd(`user:sessions:${user.id}`, refreshToken)
      .expire(`user:sessions:${user.id}`, Number(process.env["REFRESH_TOKEN_TTL"]))
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

    await this.redis
      .multi()
      .set(`refresh:${refreshToken}`, user.id, "EX", Number(process.env["REFRESH_TOKEN_TTL"]))
      .sadd(`user:sessions:${user.id}`, refreshToken)
      .expire(`user:sessions:${user.id}`, Number(process.env["REFRESH_TOKEN_TTL"]))
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

  async refresh(data: { refreshToken: string }) {
    const userId = await this.redis.get(`refresh:${data.refreshToken}`);

    if (!userId) {
      throw new AppError("Invalid refresh token", StatusCodes.UNAUTHORIZED);
    }

    // Rotate refresh token (per session)
    await this.redis
      .multi()
      .del(`refresh:${data.refreshToken}`)
      .srem(`user:sessions:${userId}`, data.refreshToken)
      .exec();

    const newRefreshToken = signRefreshToken(Number(userId));
    const accessToken = signAccessToken(Number(userId));

    await this.redis
      .multi()
      .set(`refresh:${newRefreshToken}`, userId, "EX", Number(process.env["REFRESH_TOKEN_TTL"]))
      .sadd(`user:sessions:${userId}`, newRefreshToken)
      .expire(`user:sessions:${userId}`, Number(process.env["REFRESH_TOKEN_TTL"]))
      .exec();

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(data: { refreshToken: string; devices: "current" | "all" }) {
    const userId = await this.redis.get(`refresh:${data.refreshToken}`);
    if (!userId) {
      // Idempotent logout (safe to call multiple times)
      return;
    }

    if (data.devices === "current") {
      // logout only this session
      await this.redis
        .multi()
        .del(`refresh:${data.refreshToken}`)
        .srem(`user:sessions:${userId}`, data.refreshToken)
        .exec();
    }

    if (data.devices === "all") {
      // logout all sessions
      const tokens = await this.redis.smembers(`user:sessions:${userId}`);

      if (tokens.length) {
        const pipeline = this.redis.multi();
        for (const token of tokens) {
          pipeline.del(`refresh:${token}`);
        }
        pipeline.del(`user:sessions:${userId}`);
        await pipeline.exec();
      }
    }
  }
}
