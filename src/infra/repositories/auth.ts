import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import {
  AuthRepository,
  ForgotPasswordContract,
} from "../../data/contracts/repositories/auth";
import { Administrator } from "../../domain/entities/admin";
import { Student } from "../../domain/entities/student";
import { Teacher } from "../../domain/entities/teacher";
import { generateRandomPassword } from "../../utils/auth";

export class AuthRepo implements AuthRepository {
  constructor(private readonly db: PrismaClient) {}

  async SignIn(email: string, password: string): Promise<any> {
    const student = await this.db.student.findFirst({
      where: { email: email },
    });

    const teacher = await this.db.professor.findFirst({
      where: { email: email },
    });

    const admin = await this.db.administrator.findFirst({
      where: { email: email },
    });

    if (student && (await bcrypt.compare(password, student.password)))
      return {
        id: student.id,
        name: student.name,
        email: student.email,
        password: "********",
        deleted_at: student.deleted_at,
        role: student.role,
        created_at: student.created_at,
        updated_at: student.updated_at,
      };

    if (teacher && (await bcrypt.compare(password, teacher.password)))
      return {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        password: "********",
        deleted_at: teacher.deleted_at,
        role: teacher.role,
        created_at: teacher.created_at,
        updated_at: teacher.updated_at,
      };

    if (admin && (await bcrypt.compare(password, admin.password)))
      return {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        password: "********",
        deleted_at: admin.deleted_at,
        role: admin.role,
        created_at: admin.created_at,
        updated_at: admin.updated_at,
      };

    return;
  }
  async Refresh(userId: string): Promise<any> {
    const findStudent = await this.db.student.findFirst({
      where: { id: userId },
      include: {
        answers: true,
        Class: true,
        Professor: true,
      },
    });

    const findTeacher = await this.db.professor.findFirst({
      where: { id: userId },
      include: {
        Administrator: true,
      },
    });

    const findAdmin = await this.db.administrator.findFirst({
      where: { id: userId },
      include: {
        professors: true,
      },
    });

    if (findStudent) return findStudent as Student;
    if (findTeacher) return findTeacher as Teacher;
    if (findAdmin) return findAdmin as Administrator;
  }
  async ForgotPassword(
    email: string
  ): Promise<ForgotPasswordContract | undefined> {
    const student = await this.db.student.findFirst({
      where: { email: email },
    });

    const teacher = await this.db.professor.findFirst({
      where: { email: email },
    });

    const admin = await this.db.administrator.findFirst({
      where: { email: email },
    });

    if (student && student.id) {
      try {
        const newPassword = generateRandomPassword();
        const hash = await bcrypt.hash(newPassword, 10);
        const student2 = await this.db.student.update({
          where: { id: student.id },
          data: {
            password: hash,
          },
        });

        return {
          email: student2.email,
          userName: student2.name ? student2.name : "",
          password: newPassword,
        };
      } catch (err) {
        throw new Error("Erro ao atualizar senha");
      }
    }

    if (teacher && teacher.id) {
      const newPassword = generateRandomPassword();
      const hash = await bcrypt.hash(newPassword, 10);
      try {
        const teacher2 = await this.db.professor.update({
          where: { id: teacher.id },
          data: {
            password: hash,
          },
        });

        return {
          email: teacher2.email,
          userName: teacher2.name ? teacher2.name : "",
          password: newPassword,
        };
      } catch (error) {
        throw new Error("Erro ao atualizar senha");
      }
    }

    if (admin && admin.id) {
      const newPassword = generateRandomPassword();
      const hash = await bcrypt.hash(newPassword, 10);
      try {
        const admin2 = await this.db.administrator.update({
          where: { id: admin.id },
          data: {
            password: hash,
          },
        });

        return {
          email: admin2.email,
          userName: admin2.name ? admin2.name : "",
          password: newPassword,
        };
      } catch (error) {
        throw new Error("Erro ao atualizar senha");
      }
    }

    if (!student && !teacher && !admin) throw new Error("Email não encontrado");
  }

  async ChangePassword(data: {
    lastPassword: string;
    newPassword: string;
    confirmationPassword: string;
    userID: string;
  }): Promise<void> {
    const student = await this.db.student.findFirst({
      where: { id: data.userID },
    });

    const teacher = await this.db.professor.findFirst({
      where: { id: data.userID },
    });

    const admin = await this.db.administrator.findFirst({
      where: { id: data.userID },
    });

    if (student) {
      const password = await bcrypt.compare(
        data.lastPassword,
        student.password
      );
      if (password) {
        if (data.newPassword === data.confirmationPassword) {
          const hash = await bcrypt.hash(data.newPassword, 10);
          await this.db.student.update({
            where: { id: data.userID },
            data: { password: hash },
          });
        } else {
          throw new Error("As senhas não conferem");
        }
      }
    } else if (teacher?.id) {
      const password = await bcrypt.compare(
        data.lastPassword,
        teacher.password
      );
      if (password) {
        if (data.newPassword === data.confirmationPassword) {
          const hash = await bcrypt.hash(data.newPassword, 10);
          await this.db.professor.update({
            where: { id: data.userID },
            data: { password: hash },
          });
        } else {
          throw new Error("As senhas não conferem");
        }
      }
    } else if (admin?.id) {
      const password = await bcrypt.compare(data.lastPassword, admin.password);
      if (password) {
        if (data.newPassword === data.confirmationPassword) {
          const hash = await bcrypt.hash(data.newPassword, 10);
          await this.db.administrator.update({
            where: { id: data.userID },
            data: { password: hash },
          });
        } else {
          throw new Error("As senhas não conferem");
        }
      }
    }
  }
}
