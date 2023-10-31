import { PrismaClient, StudentAnswer } from "@prisma/client";
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
  }): Promise<void> {
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
  }
  async getById(id: string): Promise<Exercise> {
    const db = await this.db.exercise.findUnique({
      where: { id },
    });
    if (!db) {
      throw new Error("Exercicio não encontrado");
    }
    return db;
  }
  async listExercises(): Promise<Exercise[]> {
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
    });
    if (!db) {
      throw new Error("Erro ao listar exercicios");
    }
    return db;
  }
  async getByUsers(id: string): Promise<StudentAnswer[]> {
    const db = await this.db.studentAnswer.findMany({
      where: { exerciseId: id },
      include: { student: true },
    });

    if (!db) {
      throw new Error("Erro ao listar exercicios");
    }
    return db;
  }
  async updateExercise(id: string, exercise: Exercise): Promise<void> {
    console.log(exercise, "repo");
    console.log(await this.db.exercise.findUnique({ where: { id } }));
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

    console.log(db, "resultado");

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
