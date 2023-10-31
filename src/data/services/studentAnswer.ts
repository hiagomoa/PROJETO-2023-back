import { AlunosItensInOut } from "../../domain/entities/alunoItensInOut";
import { StudentAnswerUseCases } from "../../domain/useCases/studentAnswer";
import { StudentAnswerRepository } from "../contracts/repositories/studentAnswer";
import { StudentAnswer } from "./../../domain/entities/studentAnswer";

export class StudentAnswerService implements StudentAnswerUseCases {
  constructor(private readonly repo: StudentAnswerRepository) {}
  async create(studentAnswer: {
    studentId: string;
    exerciseId: string;
    answer: string;
    attempts: number | string;
  }): Promise<void> {
    return await this.repo.create(studentAnswer);
  }
  async getById(id: string): Promise<StudentAnswer> {
    return await this.repo.getById(id);
  }
  async listStudentAnswers(): Promise<StudentAnswer[]> {
    return await this.repo.listStudentAnswers();
  }
  async getByExercise(id: string): Promise<StudentAnswer[]> {
    return await this.repo.getByExercise(id);
  }
  async updateStudentAnswer(
    id: string,
    studentAnswer: {
      studentId: string;
      exerciseId: string;
      answer: string;
    }
  ): Promise<void> {
    return await this.repo.updateStudentAnswer(id, studentAnswer);
  }
  async deleteStudentAnswer(id: string): Promise<void> {
    return await this.repo.deleteStudentAnswer(id);
  }
  async getAnswerOutPut(
    studentId: string,
    exerciseId: string
  ): Promise<AlunosItensInOut[]> {
    return await this.repo.getAnswerOutPut(studentId, exerciseId);
  }
}
