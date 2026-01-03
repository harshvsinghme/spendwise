import type { Response } from "express";
import { StatusCodes } from "http-status-codes";
import type CategoryService from "../services/category.service.js";
import type { IExtendedRequest } from "../types/common.js";

export default class CategoryController {
  constructor(private readonly catService: CategoryService) {}

  create = async (req: IExtendedRequest, res: Response) => {
    if (!req.user) {
      res.sendStatus(StatusCodes.UNAUTHORIZED);
      return;
    }
    const result = await this.catService.create(req.user.id, req.body);
    res.json(result);
  };

  get = async (req: IExtendedRequest, res: Response) => {
    if (!req.user) {
      res.sendStatus(StatusCodes.UNAUTHORIZED);
      return;
    }
    const result = await this.catService.get(req.user.id, req.query);
    res.json(result);
  };
}
