import { Exercise } from "../../../domain/entities/exercise";
import { StudentAnswerContract } from "../entities";

export interface ExerciseRepository {
  // post create exercise
  // get exercise by id by params
  // get list exercises
  // get students exercises by exercise
  // put update exercise
  // delete exercise

  create: (exercise: {
    dueDate: Date;
    html: string;
    name: string;
    description: string;
    maxAttempts: number | string;
    professorId: string;
    classId: string;
  }) => Promise<string>;
  getById: (id: string) => Promise<Exercise>;
  listExercises: (data: {
    id?: string;
    role?: string;
    classId?: string;
  }) => Promise<Exercise[] | undefined>;
  getByUsers: (
    id: string
  ) => Promise<{ data: StudentAnswerContract[]; inOuts: any[] }>;
  updateExercise: (id: string, exercise: Exercise) => Promise<void>;
  deleteExercise: (id: string) => Promise<void>;
}
