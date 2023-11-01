import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response, Router } from "express";
import { generateToken } from "../utils/auth";

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const admin = await prisma.administrator.findFirst({
      where: {
        email: email,
      },
    });

    const professor = await prisma.professor.findFirst({
      where: {
        email: email,
      },
    });

    const student = await prisma.student.findFirst({
      where: {
        email: email,
      },
    });

    if (admin && (await bcrypt.compare(password, admin.password))) {
      const token = generateToken({
        userId: admin.id,
        userType: admin.role,
      });
      return res.status(200).json({ user: admin, token });
    } else if (
      professor &&
      (await bcrypt.compare(password, professor.password))
    ) {
      const token = generateToken({
        userId: professor.id,
        userType: professor.role,
      });
      return res.status(200).json({ user: professor, token });
    } else if (student) {
      const token = generateToken({
        userId: student.id,
        userType: student.role,
      });
      return res.status(200).json({ user: student, token });
    } else {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};
const router = Router();

router.post("/", login);

export default router;
