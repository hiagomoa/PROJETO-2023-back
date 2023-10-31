import { ClassUseCases } from "../../domain/useCases/class";
import { ClassContract } from "../contracts/entities";
import { ClassRepository } from "../contracts/repositories/class";

export class ClassService implements ClassUseCases {
  constructor(private readonly repo: ClassRepository) {}
  async create(name: string, professorId: string): Promise<void> {
    return await this.repo.create(name, professorId);
  }
  async getById(id: string): Promise<ClassContract> {
    return await this.repo.getById(id);
  }
  async listClasses(): Promise<ClassContract[]> {
    return await this.repo.listClasses();
  }
  async updateClass(id: string, classs: ClassContract): Promise<void> {
    return await this.repo.updateClass(id, classs);
  }
  async deleteClass(id: string): Promise<void> {
    return await this.repo.deleteClass(id);
  }
}
