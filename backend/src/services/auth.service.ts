import { createHash, randomBytes } from "crypto";
import { StatusCodes } from "http-status-codes";
import type { Redis } from "ioredis";
import AppError from "../errors/app-error.js";
import type { DB } from "../infra/db/db.js";
import { sendEmail } from "../infra/email/email.service.js";
import { RESET_PASSWORD } from "../infra/email/templates/reset-password.js";
import type PasswordResetRepository from "../repositories/passwordReset.repository.js";
import type UserRepository from "../repositories/user.repository.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";
import { utcTime } from "../utils/time.js";

export default class AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly passwordResetRepo: PasswordResetRepository,
    private readonly db: DB,
    private readonly redis: Redis
  ) {}

  async signup(data: { name: string; email: string; password: string; currency: string }) {
    const existingUser = await this.db.withoutUser((client) =>
      this.userRepo.findByEmail(client, { email: data.email })
    );
    if (existingUser) {
      throw new AppError(`Email already in use`, StatusCodes.CONFLICT);
    }
    const hash = await hashPassword(data.password);
    const user = await this.db.withoutUser((client) =>
      this.userRepo.create(client, {
        name: data.name,
        email: data.email,
        password_hash: hash,
        currency: data.currency,
      })
    );

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
    const user = await this.db.withoutUser((client) =>
      this.userRepo.findByEmail(client, { email: data.email })
    );

    if (!user) {
      throw new AppError("No matching user found", StatusCodes.UNAUTHORIZED);
    }

    const ok = await comparePassword(data.password, user.password_hash);
    if (!ok) {
      throw new AppError("No matching user found", StatusCodes.UNAUTHORIZED);
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
        currency: user.currency,
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

  async forgotPassword(data: { email: string }) {
    const user = await this.db.withoutUser((client) =>
      this.userRepo.findByEmail(client, { email: data.email })
    );
    if (user) {
      const token = randomBytes(32).toString("hex");
      const tokenHash = createHash("sha256").update(token).digest("hex");

      await this.db.withoutUser((client) =>
        this.passwordResetRepo.create(client, {
          token: tokenHash,
          user_id: user.id,
          expires_at: utcTime().add(15, "minutes").toDate(),
        })
      );

      sendEmail({
        template: RESET_PASSWORD,
        data: { name: user.name, link: `${process.env["APP_URL"]}/reset-password?token=${token}` },
        recipients: [data.email],
      });
    }
    return { message: `A reset password token is sent to your registered email, if it exists` };
  }
  async resetPassword(data: { token: string; password: string }) {
    // encrypt the token and find its hash record in DB
    const tokenHash = createHash("sha256").update(data.token).digest("hex");
    const passRecord = await this.db.withoutUser((client) =>
      this.passwordResetRepo.findByToken(client, { token: tokenHash })
    );

    // validate the password_resets request expires_at
    if (!passRecord || utcTime().isAfter(passRecord.expires_at)) {
      throw new AppError("Invalid or expired reset token", StatusCodes.BAD_REQUEST);
    }

    // validate user existence against password_resets.user_id
    const userRecord = await this.db.withoutUser((client) =>
      this.userRepo.findById(client, { userId: passRecord.user_id })
    );
    if (!userRecord) {
      throw new AppError(
        `The user whose password you want to change does not exist`,
        StatusCodes.CONFLICT
      );
    }
    // hash the password with bcrypt
    const passHash = await hashPassword(data.password);
    // update users with user_id for its password (new)
    await this.db.withoutUser((client) =>
      this.userRepo.updatePassword(client, { userId: userRecord.id, passwordHash: passHash })
    );
    // delete password_resets records for user_id
    await this.db.withoutUser((client) =>
      this.passwordResetRepo.deleteByUserId(client, { user_id: userRecord.id })
    );
  }
}
