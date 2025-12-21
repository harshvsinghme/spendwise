import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env["JWT_ACCESS_SECRET"]!;
const REFRESH_SECRET = process.env["JWT_REFRESH_SECRET"]!;

export const signAccessToken = (userId: number) =>
  jwt.sign({ sub: userId }, ACCESS_SECRET, { expiresIn: "15m" });

export const signRefreshToken = (userId: number) =>
  jwt.sign({ sid: userId }, REFRESH_SECRET, { expiresIn: "30d" });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, ACCESS_SECRET) as unknown as { sub: number };
