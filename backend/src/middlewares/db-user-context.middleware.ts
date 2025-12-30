import type { NextFunction, Response } from "express";
import pool from "../infra/db/postgres.js";
import type { IExtendedRequest } from "../types/common.js";

/**
 * For NON-TRANSACTION queries, Ensure releasing with "releaseDbClient" middleware
 */
export async function dbUserContext(req: IExtendedRequest, _res: Response, next: NextFunction) {
  if (!req.user) return next(); // public routes

  const client = await pool.connect();

  try {
    await client.query(`SET app.user_id = $1`, [req.user.id]);

    // attach client to request
    req.db = client;

    next();
  } catch (err) {
    client.release();
    next(err);
  }
}

/**
 * For NON-TRANSACTION queries, and its usage is dependent on "dbUserContext" middleware
 */
export function releaseDbClient(req: IExtendedRequest, _res: Response, next: NextFunction) {
  const client = req.db;
  if (client) client.release();
  next();
}
