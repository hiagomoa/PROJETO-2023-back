import jwt from "jsonwebtoken";
import { emailTemplateFolder } from "../../server";
import { sendEmail } from "../../shared/providers/emailService/sendEmail";
import { AuthRepository, JWTResult } from "../contracts/repositories/auth";

export class AuthService {
  constructor(private readonly repo: AuthRepository) {}

  async sign(email: string, password: string) {
    const user = await this.repo.SignIn(email, password);

    const secret = process.env.JWT_SECRET;
    const token = jwt.sign({}, "lucas", {
      subject: user.id,
      expiresIn: "1h",
    });

    return { user, token };
  }

  async refresh(token: string): Promise<JWTResult> {
    const secret = process.env.JWT_SECRET;
    const dcdd = await this.validate(token);
    console.log(dcdd, "dcdd");
    const user = await this.repo.Refresh(dcdd);
    const newToken = jwt.sign({}, "lucas", {
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

  async forgotPassword(email: string) {
    try {
      const user = await this.repo.ForgotPassword(email);

      await sendEmail({
        body: {
          email: user?.email,
          password: user?.password,
        },
        emailTemplatePath: `${emailTemplateFolder}/create-password-template.hbs`,
        from: process.env.EMAIL_FROM as string,
        subject: "Nova Password",
        to: email,
      });
    } catch (error) {
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
      throw new Error(error?.message);
    }
  }
}
