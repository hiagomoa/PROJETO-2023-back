import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { AuthRepository } from "../../data/contracts/repositories/auth";
import { Administrator } from "../../domain/entities/admin";
import { Student } from "../../domain/entities/student";
import { Teacher } from "../../domain/entities/teacher";

export class AuthRepo implements AuthRepository {
  constructor(private readonly db: PrismaClient) {}
  async SignIn(email: string, password: string): Promise<any> {
    const student = await this.db.student.findFirst({
      where: { email: email },
      include: {
        answers: true,
        Class: true,
        Professor: true,
      },
    });

    const teacher = await this.db.professor.findFirst({
      where: { email: email },
      include: {
        Administrator: true,
      },
    });

    const admin = await this.db.administrator.findFirst({
      where: { email: email },
      include: {
        professors: true,
      },
    });

    if (student && student.password === password) return student as Student;

    if (teacher && (await bcrypt.compare(password, teacher.password)))
      return teacher as Teacher;

    if (admin && (await bcrypt.compare(password, admin.password)))
      return {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        password: "********",
        role: admin.role,
        created_at: admin.created_at,
        updated_at: admin.updated_at,
      } as Administrator;
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
}
