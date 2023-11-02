import bcrypt from "bcrypt";

import { AdminUseCases } from "../../domain/useCases/admin";
import { AdminContract } from "../contracts/entities";
import { AdminRepository } from "../contracts/repositories/admin";

export class AdminService implements AdminUseCases {
  constructor(private repo: AdminRepository) {}

  async create(
    name: string,
    email: string,
    password: string
  ): Promise<AdminContract> {
    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.repo.create(name, email, hashedPassword);
  }

  async getById(id: string): Promise<AdminContract> {
    return await this.repo.getById(id);
  }

  async listAdmins(): Promise<AdminContract[]> {
    return await this.repo.listAdmins();
  }

  async updateAdmin(id: string, admin: AdminContract): Promise<void | string> {
    return await this.repo.updateAdmin(id, admin);
  }

  async deleteAdmin(id: string): Promise<void | string> {
    return await this.repo.deleteAdmin(id);
  }
}
