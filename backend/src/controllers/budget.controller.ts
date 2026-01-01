import type { Response } from "express";
import { StatusCodes } from "http-status-codes";
import type BudgetService from "../services/budget.service.js";
import type { IExtendedRequest } from "../types/common.js";

export default class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  createMyBudget = async (req: IExtendedRequest, res: Response) => {
    if (!req.user) {
      res.sendStatus(StatusCodes.UNAUTHORIZED);
      return;
    }
    const result = await this.budgetService.createMyBudget(req.user.id, req.body);
    res.json(result);
  };
}
