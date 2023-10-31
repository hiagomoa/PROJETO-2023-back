import { Student } from "../../domain/entities/student";
import { StudentUseCases } from "../../domain/useCases/student";
import { StudentRepository } from "../contracts/repositories/student";

export class StudentService implements StudentUseCases {
  constructor(private readonly repo: StudentRepository) {}

  async create(student: {
    name: string;
    email: string;
    professorId: string;
    classId: string;
    ra: string;
  }): Promise<void> {
    return await this.repo.create(student);
  }
  async getById(id: string): Promise<Student> {
    return await this.repo.getById(id);
  }
  async listStudents(data: {
    id?: string | null;
    role?: string | null;
  }): Promise<Student[]> {
    let id = data.id ? data.id : null;
    let role = data.role;

    return await this.repo.listStudents(id, role);
  }
  async updateStudent(
    id: string,
    student: {
      name: string;
      email: string;
      password: string;
      professorId: string;
      classId: string;
      ra: string;
    }
  ): Promise<void> {
    return await this.repo.updateStudent(id, student);
  }
  async deleteStudent(id: string): Promise<void> {
    return await this.repo.deleteStudent(id);
  }
}
