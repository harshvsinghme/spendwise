import type { Request } from "express";

export interface IExtendedRequest extends Request {
  user?: {
    id: number;
  };
}
