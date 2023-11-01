import { PrismaClient } from "@prisma/client";
import { AdminContract } from "../../data/contracts/entities";
import { Administrator } from "../../domain/entities/admin";
import { AdminRepository } from "./../../data/contracts/repositories/admin";

export class AdminRepo implements AdminRepository {
  constructor(private db: PrismaClient) {}
  async create(
    name: string,
    email: string,
    password: string
  ): Promise<AdminContract> {
    console.log(name, email, password, "DB REPOS");
    const db = await this.db.administrator.create({
      data: {
        name,
        email,
        password,
      },
    });
    if (!db) {
      throw new Error("Erro ao criar administrador - DB");
    }
    return {
      id: db.id,
      name: db.name,
      email: db.email,
      password: db.password,
      created_at: db.created_at,
      updated_at: db.updated_at,
      deleted_at: db.deleted_at,
      role: db.role,
    };
  }
  async getById(id: string): Promise<Administrator> {
    const db = await this.db.administrator.findFirst({
      where: { id: id },
    });
    console.log(db?.id, "DB REPOS");
    if (!db?.id) {
      throw new Error("Administrador não encontradoo oooooooo");
    }
    return {
      id: db.id,
      name: db.name,
      email: db.email,
      password: db.password,
      created_at: db.created_at,
      updated_at: db.updated_at,
      deleted_at: db.deleted_at,
      role: db.role,
    };
  }
  async listAdmins(): Promise<Administrator[]> {
    const db = await this.db.administrator.findMany();
    if (!db) {
      throw new Error("Erro ao listar administradores");
    }
    return db.map((admin) => ({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      password: admin.password,
      created_at: admin.created_at,
      updated_at: admin.updated_at,
      deleted_at: admin.deleted_at,
      role: admin.role,
    }));
  }
  async updateAdmin(id: string, admin: Administrator): Promise<void> {
    const db = await this.db.administrator.update({
      where: { id },
      data: admin,
    });

    if (!db) {
      throw new Error("Erro ao atualizar administrador");
    }
  }
  async deleteAdmin(id: string): Promise<void> {
    const db = await this.db.administrator.update({
      where: { id },
      data: { deleted_at: new Date() },
    });

    if (!db) {
      throw new Error("Erro ao deletar administrador");
    }
  }
}
