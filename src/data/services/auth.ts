import jwt from "jsonwebtoken";
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
}
