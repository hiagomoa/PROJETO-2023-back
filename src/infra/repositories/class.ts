import { PrismaClient } from "@prisma/client";
import { ClassRepository } from "../../data/contracts/repositories/class";
import { Class } from "../../domain/entities/class";

export class ClassRepo implements ClassRepository {
  constructor(private readonly db: PrismaClient) {}
  async create(name: string, professorId: string): Promise<void> {
    const db = await this.db.class.create({
      data: {
        name,
        professorId,
      },
    });
    if (!db) {
      throw new Error("Erro ao criar classe");
    }
  }
  async getById(id: string): Promise<Class> {
    const db = await this.db.class.findUnique({
      where: { id, deleted_at: null },
      include: { students: true },
    });
    if (!db) {
      throw new Error("Classe não encontrada");
    }
    return {
      id: db.id,
      name: db.name,
      professorId: db.professorId,
      students: db.students,
      created_at: db.created_at,
      updated_at: db.updated_at,
      deleted_at: db.deleted_at,
    };
  }
  async listClasses(): Promise<Class[]> {
    const db = await this.db.class.findMany({ include: { students: true } });
    if (!db) {
      throw new Error("Erro ao listar classes");
    }
    return db.map((classs) => ({
      id: classs.id,
      name: classs.name,
      professorId: classs.professorId,
      students: classs.students,
      created_at: classs.created_at,
      updated_at: classs.updated_at,
      deleted_at: classs.deleted_at,
    }));
  }
  async updateClass(id: string, classs: Class): Promise<void> {
    const db = await this.db.class.update({
      where: { id },
      data: {
        name: classs.name,
        professorId: classs.professorId,
      },
    });
    if (!db) {
      throw new Error("Erro ao atualizar classe");
    }
  }
  async deleteClass(id: string): Promise<void> {
    const db = await this.db.class.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    if (!db) {
      throw new Error("Erro ao deletar classe");
    }
  }
}
