import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { TeacherRepository } from "../../data/contracts/repositories/teacher";
import { Teacher } from "../../domain/entities/teacher";

export class TeacherRepo implements TeacherRepository {
  constructor(private readonly db: PrismaClient) {}
  async create(teacher: {
    name: string;
    email: string;
    password: string;
    administratorId: string;
  }): Promise<void> {
    const db = await this.db.professor.create({
      data: teacher,
    });

    if (!db) {
      throw new Error("Erro ao criar professor");
    }
  }
  async getById(id: string): Promise<Teacher> {
    const db = await this.db.professor.findUnique({
      where: { id },
    });

    if (!db) {
      throw new Error("Professor não encontrado");
    }
    return db;
  }
  async listTeachers(): Promise<Teacher[]> {
    const db = await this.db.professor.findMany();

    if (!db) {
      throw new Error("Erro ao listar professores");
    }
    return db;
  }
  async updateTeacher(
    id: string,
    teacher: { name?: string; password?: string }
  ): Promise<void> {
    const hash = await bcrypt.hash(teacher.password!, 10);
    const data = {
      name: teacher.name,
      password: hash,
    };
    const db = await this.db.professor.update({
      where: { id },
      data: data,
    });

    if (!db) {
      throw new Error("Erro ao atualizar professor");
    }
  }
  async deleteTeacher(id: string): Promise<void> {
    await this.db.professor.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}
