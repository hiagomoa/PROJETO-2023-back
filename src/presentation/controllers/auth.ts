import { Request, Response } from "express";
import { JWTResult } from "../../data/contracts/repositories/auth";
import { AuthService } from "../../data/services/auth";
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async sign(req: Request, res: Response): Promise<Response<JWTResult>> {
    try {
      const { email, password } = req.body;

      const { user, token } = await this.authService.sign(email, password);

      return res.status(200).json({ user, token });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }

  async refresh(req: Request, res: Response): Promise<Response<JWTResult>> {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token)
        return res.status(401).json({ error: "Token não informado." });
      const { user, token: newToken } = await this.authService.refresh(token);
      return res.status(200).json({ user, token: newToken });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
}
