import { StudentAnswer } from "@prisma/client";
import { Exercise } from "../../../domain/entities/exercise";

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
  }) => Promise<void>;
  getById: (id: string) => Promise<Exercise>;
  listExercises: () => Promise<Exercise[]>;
  getByUsers: (id: string) => Promise<StudentAnswer[]>;
  updateExercise: (id: string, exercise: Exercise) => Promise<void>;
  deleteExercise: (id: string) => Promise<void>;
}
