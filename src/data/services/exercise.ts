import { Exercise } from "../../domain/entities/exercise";
import { StudentAnswer } from "../../domain/entities/studentAnswer";
import { ExerciseUseCases } from "../../domain/useCases/exercise";
import { ExerciseRepository } from "../contracts/repositories/exercise";

export class ExerciseService implements ExerciseUseCases {
  constructor(private readonly repo: ExerciseRepository) {}

  async create(exercise: {
    name: string;
    description: string;
    dueDate: Date;
    html: string;
    professorId: string;
    classId: string;
    maxAttempts: string | number;
  }): Promise<void> {
    return await this.repo.create(exercise);
  }
  async getById(id: string): Promise<Exercise> {
    return await this.repo.getById(id);
  }
  async listExercises(): Promise<Exercise[]> {
    return await this.repo.listExercises();
  }
  async getByUsers(id: string): Promise<StudentAnswer[]> {
    return await this.repo.getByUsers(id);
  }
  async updateExercise(id: string, exercise: Exercise): Promise<void> {
    return await this.repo.updateExercise(id, exercise);
  }
  async deleteExercise(id: string): Promise<void> {
    return await this.repo.deleteExercise(id);
  }
}
