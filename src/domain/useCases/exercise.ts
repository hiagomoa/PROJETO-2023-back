import { Exercise } from "../entities/exercise";
import { StudentAnswer } from "../entities/studentAnswer";

export interface ExerciseUseCases {
  // post create exercise
  // get exercise by id by params
  // get list exercises
  // get students exercises by exercise
  // put update exercise
  // delete exercise

  create: (exercise: {
    name: string;
    description: string;
    dueDate: Date;
    html: string;
    professorId: string;
    classId: string;
    maxAttempts: string | number;
  }) => Promise<void>;
  getById: (id: string) => Promise<Exercise>;
  listExercises: () => Promise<Exercise[]>;
  getByUsers: (id: string) => Promise<StudentAnswer[]>;
  updateExercise: (id: string, exercise: any) => Promise<void>;
  deleteExercise: (id: string) => Promise<void>;
}
