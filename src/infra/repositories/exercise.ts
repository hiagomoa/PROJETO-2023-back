import { PrismaClient } from "@prisma/client";
import { StudentAnswerContract } from "../../data/contracts/entities";
import { ExerciseRepository } from "../../data/contracts/repositories/exercise";
import { Exercise } from "../../domain/entities/exercise";

export class ExerciseRepo implements ExerciseRepository {
  constructor(private readonly db: PrismaClient) {}
  async create(exercise: {
    dueDate: Date;
    html: string;
    name: string;
    description: string;
    maxAttempts: number | string;
    professorId: string;
    classId: string;
  }): Promise<string> {
    const db = await this.db.exercise.create({
      data: {
        dueDate: exercise.dueDate,
        html: exercise.html,
        name: exercise.name,
        description: exercise.description,
        maxAttempts: Number(exercise.maxAttempts),
        professorId: exercise.professorId,
        classId: exercise.classId,
      },
    });

    if (!db) {
      throw new Error("Erro ao criar exercicio");
    }

    return db.id;
  }

  async getById(id: string): Promise<Exercise> {
    const db = await this.db.exercise.findFirst({
      where: { classId: id },
    });
    if (!db) {
      throw new Error("Exercicio não encontrado");
    }
    return db;
  }

  async listExercises(data: {
    id?: string;
    role?: string;
    classId?: string;
  }): Promise<Exercise[] | undefined> {
    if (data.role === "PROFESSOR") {
      const db = await this.db.exercise.findMany({
        select: {
          classId: true,
          created_at: true,
          deleted_at: true,
          description: true,
          dueDate: true,
          html: true,
          id: true,
          maxAttempts: true,
          name: true,
          professorId: true,
          StudentAnswer: true,
          updated_at: true,
          Professor: true,
          report: true,
          class: true,
        },
        where: {
          professorId: data.id,
          deleted_at: null,
          classId: data.classId,
        },
      });
      if (db.length < 1) {
        throw new Error("Erro ao listar ");
      }
      return db;
    } else if (data.role === "STUDENT") {
      const db = await this.db.exercise.findMany({
        select: {
          classId: true,
          created_at: true,
          deleted_at: true,
          description: true,
          dueDate: true,
          html: true,
          id: true,
          maxAttempts: true,
          name: true,
          professorId: true,
          StudentAnswer: true,
          updated_at: true,
          Professor: true,
          class: true,
        },
        where: {
          deleted_at: null,
          classId: data.classId,
        },
      });

      if (!db) {
        throw new Error("Erro ao listar exercicios");
      }

      if (data.classId) {
        const filter = db.filter((item) => item.classId === data.classId);

        return filter;
      }

      const user = await this.db.student.findFirst({
        where: { id: data.id },
      });

      if (!user) {
        throw new Error("Erro ao listar exercicios");
      }

      const dbfilt = await this.db.student.findMany({
        where: { email: user?.email },
      });

      const filter = db.filter((item) => {
        const usr = dbfilt.filter((item2) => item2.classId === item.classId);
        if (usr.length > 0) {
          return item;
        }
        return null;
      });
      return filter;
    }
  }
  async getByUsers(
    id: string
  ): Promise<{ data: StudentAnswerContract[]; inOuts: any[] }> {
    const db = await this.db.studentAnswer.findMany({
      where: { exerciseId: id },
      include: { student: true },
    });

    const inOuts = await this.db.alunoItensInOut.findMany({
      where: { exerciseId: id },
      include: { StudentAnswer: true },
    });

    if (!db) {
      throw new Error("Erro ao listar exercicios");
    }
    return { data: db, inOuts: inOuts };
  }
  async updateExercise(id: string, exercise: Exercise): Promise<void> {
    const db = await this.db.exercise.update({
      where: { id },
      data: {
        name: exercise.name,
        description: exercise.description,
        dueDate: new Date(exercise.dueDate),
        html: exercise.html,
        maxAttempts: exercise.maxAttempts,
        professorId: exercise.professorId,
        classId: exercise.classId,
      },
    });

    if (!db) {
      throw new Error("Erro ao atualizar exercicio");
    }
  }
  async deleteExercise(id: string): Promise<void> {
    const db = await this.db.exercise.update({
      where: { id },
      data: { deleted_at: new Date() },
    });

    if (!db) {
      throw new Error("Erro ao deletar exercicio");
    }
  }
}
