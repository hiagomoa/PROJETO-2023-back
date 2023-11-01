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

  async forgotPassword(req: Request, res: Response): Promise<Response> {
    try {
      const { email } = req.body;

      await this.authService.forgotPassword(email);

      return res.status(200).json({ message: "Email enviado com sucesso." });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return res.status(500).json({ error: error?.message });
    }
  }

  async changePassword(req: Request, res: Response): Promise<Response<void>> {
    try {
      req.body;
      console.log(req.body);
      console.log(req.query);
      const { last: a, new: b, confirmation, user } = req.query;
      if (!a || !b || !confirmation || !user)
        return res.status(400).json({ error: "Dados inválidos." });
      await this.authService.changePassword({
        lastPassword: String(a),
        newPassword: String(b),
        confirmationPassword: String(confirmation),
        userID: String(user),
      });
      return res.status(200).json({ message: "Senha alterada com sucesso." });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return res.status(500).json({ error: error?.message });
    }
  }
}
