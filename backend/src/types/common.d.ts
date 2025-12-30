import type { Request } from "express";
import type { PoolClient } from "pg";

export interface IExtendedRequest extends Request {
  user?: {
    id: number;
  };
  db?: PoolClient;
}
