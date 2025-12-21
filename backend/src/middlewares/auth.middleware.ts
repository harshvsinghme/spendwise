import type { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { IExtendedRequest } from "../types/common.js";
import { verifyAccessToken } from "../utils/jwt.js";

export function requireAuth(req: IExtendedRequest, res: Response, next: NextFunction) {
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
    next();
  } catch {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
  }
}
