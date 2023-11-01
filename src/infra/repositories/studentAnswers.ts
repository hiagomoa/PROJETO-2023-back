import { PrismaClient } from "@prisma/client";
import { StudentAnswerRepository } from "../../data/contracts/repositories/studentAnswer";
import { AlunosItensInOut } from "../../domain/entities/alunoItensInOut";
import { StudentAnswer } from "../../domain/entities/studentAnswer";

export class StudentAnswerRepo implements StudentAnswerRepository {
  constructor(private readonly db: PrismaClient) {}
  async create(studentAnswer: {
    studentId: string;
    exerciseId: string;
    answer: string;
    attempts: number | string;
  }): Promise<void> {
    const db = await this.db.studentAnswer.create({
      data: {
        studentId: studentAnswer.studentId,
        exerciseId: studentAnswer.exerciseId,
        answer: studentAnswer.answer,
        attempts: Number(studentAnswer.attempts),
      },
    });
    if (!db) {
      throw new Error("Erro ao criar resposta do estudante");
    }
  }
  async getById(id: string): Promise<StudentAnswer> {
    const db = await this.db.studentAnswer.findUnique({
      where: { id },
    });
    if (!db) {
      throw new Error("Resposta do estudante não encontrada");
    }
    return db;
  }
  async listStudentAnswers(): Promise<StudentAnswer[]> {
    const db = await this.db.studentAnswer.findMany();
    if (!db) {
      throw new Error("Erro ao listar respostas do estudante");
    }
    return db;
  }
  async getByExercise(id: string): Promise<StudentAnswer[]> {
    const db = await this.db.studentAnswer.findMany({
      where: { exerciseId: id },
    });

    if (!db) {
      throw new Error("Erro ao listar respostas do estudante");
    }
    return db;
  }
  async updateStudentAnswer(
    id: string,
    studentAnswer: {
      studentId: string;
      exerciseId: string;
      answer: string;
    }
  ): Promise<void> {
    const db = await this.db.studentAnswer.update({
      where: { id },
      data: studentAnswer,
    });

    if (!db) {
      throw new Error("Erro ao atualizar resposta do estudante");
    }
  }
  async deleteStudentAnswer(id: string): Promise<void> {
    const db = await this.db.studentAnswer.update({
      where: { id },
      data: { deleted_at: new Date() },
    });

    if (!db) {
      throw new Error("Erro ao deletar resposta do estudante");
    }
  }
  async getAnswerOutPut(
    studentId: string,
    exerciseId: string
  ): Promise<AlunosItensInOut[]> {
    const db = await this.db.alunoItensInOut.findMany({
      where: { studentId, exerciseId },
    });
    if (!db) {
      throw new Error("Resposta do estudante não encontrada");
    }
    return db;
  }
}
