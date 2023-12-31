import { AlunosItensInOutWIthAttempts } from "../../../domain/entities/alunoItensInOut";
import { StudentAnswer } from "../../../domain/entities/studentAnswer";

export interface StudentAnswerRepository {
  create: (studentAnswer: {
    studentId: string;
    exerciseId: string;
    answer: string;
    attempts: number | string;
  }) => Promise<void>;
  getById: (id: string) => Promise<StudentAnswer>;
  listStudentAnswers: () => Promise<StudentAnswer[]>;
  getByExercise: (id: string) => Promise<StudentAnswer[]>;
  updateStudentAnswer: (
    id: string,
    studentAnswer: {
      studentId: string;
      exerciseId: string;
      answer: string;
    }
  ) => Promise<void>;
  deleteStudentAnswer: (id: string) => Promise<void>;
  getAnswerOutPut: (
    studentId: string,
    exerciseId: string
  ) => Promise<AlunosItensInOutWIthAttempts>;
}
