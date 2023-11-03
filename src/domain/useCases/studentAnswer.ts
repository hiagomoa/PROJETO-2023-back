import { AlunosItensInOutWIthAttempts } from "../entities/alunoItensInOut";
import { StudentAnswer } from "../entities/studentAnswer";

export interface StudentAnswerUseCases {
  // create student answer
  // get student answer by id
  // getanswerout put
  // get list student answers
  // get list student answers by exercise
  // put update student answer
  // delete student answer

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
