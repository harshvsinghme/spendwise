import type { Request, Response } from "express";
import type AuthService from "../services/auth.service.js";

export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  signup = async (req: Request, res: Response) => {
    const result = await this.authService.signup(req.body);
    res.json(result);
  };

  login = async (req: Request, res: Response) => {
    const result = await this.authService.login(req.body);
    res.json(result);
  };

  refresh = async (req: Request, res: Response) => {
    const result = await this.authService.refresh(req.body);
    res.json(result);
  };
  logout = async (req: Request, res: Response) => {
    const result = await this.authService.logout(req.body);
    res.json(result);
  };
}
