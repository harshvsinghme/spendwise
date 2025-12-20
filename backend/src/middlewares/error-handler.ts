import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AppError from "../errors/app-error.js";
import logger from "../infra/logger/logger.js";

export default function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    logger.warn({ err }, "Operational error");

    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  logger.error({ err }, "Unhandled error");

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: "Internal Server Error",
  });
  return;
}
