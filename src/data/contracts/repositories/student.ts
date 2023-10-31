import { Student } from "../../../domain/entities/student";

export interface StudentRepository {
  // create student
  // get student by id
  // list students
  // update student
  // delete student

  create: (student: {
    name: string;
    email: string;
    professorId: string;
    classId: string;
    ra: string;
  }) => Promise<void>;
  getById: (id: string) => Promise<Student>;
  listStudents: (
    id?: string | null,
    role?: string | null
  ) => Promise<Student[]>;
  updateStudent: (
    id: string,
    student: {
      name: string;
      email: string;
      password: string;
      professorId: string;
      classId: string;
      ra: string;
    }
  ) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
}
