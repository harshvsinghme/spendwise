// import type { NextFunction, Request, Response } from "express";
// import { StatusCodes } from "http-status-codes";
// import jwt from "jsonwebtoken";
// import { AppError } from "../errors/app-error.js";

// export function auth(req: Request, _res: Response, next: NextFunction) {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
//   }

//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET!);
//     req.user = payload;
//     next();
//   } catch {
//     throw new AppError("Invalid token", StatusCodes.UNAUTHORIZED);
//   }
// }


// import { asyncHandler } from "./async-handler.js";
// import { AppError } from "../errors/app-error.js";
// import { StatusCodes } from "http-status-codes";

// export const auth = asyncHandler(async (req, _res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
//   }

//   const user = await getUserFromToken(token); // async DB call

//   if (!user) {
//     throw new AppError("Invalid token", StatusCodes.UNAUTHORIZED);
//   }

//   req.user = user;
//   next();
// });


// app.get(
//   "/protected",
//   auth,
//   asyncHandler(async (req, res) => {
//     res.json({ user: req.user });
//   })
// );
