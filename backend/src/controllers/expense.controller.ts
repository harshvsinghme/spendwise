import type { Response } from "express";
import { StatusCodes } from "http-status-codes";
import type ExpenseService from "../services/expense.service.js";
import type { IExtendedRequest } from "../types/common.js";

export default class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  create = async (req: IExtendedRequest, res: Response) => {
    if (!req.user) {
      res.sendStatus(StatusCodes.UNAUTHORIZED);
      return;
    }
    const result = await this.expenseService.create(req.user.id, req.body);
    res.json(result);
  };

  get = async (req: IExtendedRequest, res: Response) => {
    if (!req.user) {
      res.sendStatus(StatusCodes.UNAUTHORIZED);
      return;
    }
    const result = await this.expenseService.get(req.user.id, req.query);
    res.json(result);
  };
}
