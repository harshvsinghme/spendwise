import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserService } from "../services/user.service.js";

export class UserController {
  constructor(private readonly userService: UserService) {}

  list = async (_req: Request, res: Response) => {
    const users = await this.userService.listUsers();
    res.json({ data: users });
  };

  create = async (req: Request, res: Response) => {
    const { id, name } = req.body;
    const user = await this.userService.createUser(id, name);
    res.status(StatusCodes.CREATED).json({ data: user });
  };
}
