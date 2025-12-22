import jwt from "jsonwebtoken";

export const signAccessToken = (userId: number) =>
  jwt.sign({ sub: userId }, process.env["JWT_ACCESS_SECRET"]!, {
    expiresIn: Number(process.env["ACCESS_TOKEN_TTL"]),
  });

export const signRefreshToken = (userId: number) =>
  jwt.sign({ sid: userId }, process.env["JWT_REFRESH_SECRET"]!, {
    expiresIn: Number(process.env["REFRESH_TOKEN_TTL"]),
  });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, process.env["JWT_ACCESS_SECRET"]!) as unknown as { sub: number };
