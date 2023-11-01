import { TeacherUseCases } from "../../domain/useCases/teacher";
import { TeacherContract } from "../contracts/entities";
import { TeacherRepository } from "./../contracts/repositories/teacher";

export class TeacherService implements TeacherUseCases {
  constructor(private readonly repo: TeacherRepository) {}
  async create(teacher: {
    name: string;
    email: string;
    password: string;
    administratorId: string;
  }): Promise<void> {
    return await this.repo.create(teacher);
  }
  async getById(id: string): Promise<TeacherContract> {
    return await this.repo.getById(id);
  }
  async listTeachers(): Promise<TeacherContract[]> {
    return await this.repo.listTeachers();
  }
  async updateTeacher(
    id: string,
    teacher: { name?: string; password?: string }
  ): Promise<void> {
    return await this.repo.updateTeacher(id, teacher);
  }
  async deleteTeacher(id: string): Promise<void> {
    return await this.repo.deleteTeacher(id);
  }
}
