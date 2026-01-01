import type { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import assert from "node:assert";
import type { DB } from "../infra/db/db.js";
import type UserRepository from "../repositories/user.repository.js";
import type { IExtendedRequest } from "../types/common.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const requireAuth =
  (userRepo: UserRepository, db: DB) =>
  async (req: IExtendedRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) {
      res.sendStatus(StatusCodes.UNAUTHORIZED);
      return;
    }

    const token = header.split(" ")[1];
    if (!token) {
      res.sendStatus(StatusCodes.UNAUTHORIZED);
      return;
    }

    try {
      const payload = verifyAccessToken(token);
      req.user = {
        id: payload.sub,
      };
      assert(await db.withoutUser((client) => userRepo.findById(client, { userId: payload.sub })));
      next();
    } catch {
      res.sendStatus(StatusCodes.UNAUTHORIZED);
    }
  };
