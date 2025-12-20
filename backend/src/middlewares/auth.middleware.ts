import type { NextFunction, Response } from "express";
import type { IExtendedRequest } from "../types/common.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const authMiddleware = (req: IExtendedRequest, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) throw new Error("Unauthorized");

  const token = header.replace("Bearer ", "");
  const payload = verifyAccessToken(token);

  req.user = { id: payload.sub };
  next();
};
