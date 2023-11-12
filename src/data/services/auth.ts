import jwt from "jsonwebtoken";
import { ResendProviderContract } from "../../shared/providers/emailService/resend";
import { AuthRepository, JWTResult } from "../contracts/repositories/auth";

export class AuthService {
  constructor(
    private readonly repo: AuthRepository,
    private readonly resend: ResendProviderContract
  ) {}

  async sign(email: string, password: string) {
    const user = await this.repo.SignIn(email, password);
    if (!user) throw new Error("Usuário não encontrado");
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign({}, secret!, {
      subject: user?.id,
      expiresIn: "1h",
    });

    return { user, token };
  }

  async refresh(token: string): Promise<JWTResult> {
    const secret = process.env.JWT_SECRET;
    const dcdd = await this.validate(token);

    const user = await this.repo.Refresh(dcdd);
    const newToken = jwt.sign({}, secret!, {
      subject: user.id,
      expiresIn: "1h",
    });
    return { user, token: newToken };
  }

  async validate(token: string): Promise<string> {
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.decode(token, { json: true, complete: true });

    return decoded?.payload.sub as string;
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      const user = await this.repo.ForgotPassword(email);
      console.log;

      if (user) {
        await this.resend.sendForgotPassword(
          user.email,
          user.userName,
          user.password
        );
      }
    } catch (error) {
      // @ts-ignore
      throw new Error(error?.message);
    }
  }

  async changePassword(data: {
    lastPassword: string;
    newPassword: string;
    confirmationPassword: string;
    userID: string;
  }) {
    try {
      await this.repo.ChangePassword(data);
    } catch (error) {
      //@ts-ignore
      throw new Error(error?.message);
    }
  }
}
