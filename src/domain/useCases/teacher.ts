import { Teacher } from "../entities/teacher";

export interface TeacherUseCases {
  // create professor
  // get professor by id by params
  // get list professors
  // put update professor
  // delete professor

  create: (teacher: {
    name: string;
    email: string;
    password: string;
    administratorId: string;
  }) => Promise<void>;
  getById: (id: string) => Promise<Teacher>;
  listTeachers: () => Promise<Teacher[]>;
  updateTeacher: (
    id: string,
    teacher: { name?: string; password?: string }
  ) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;
}
