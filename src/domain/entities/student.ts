import { StudentAnswer } from "./studentAnswer";

export type Student = {
  id: string;
  name?: string | null;
  email: string;
  password: string;
  ra?: string | null;
  role: "STUDENT" | "PROFESSOR" | "ADMIN";
  professorId?: string | null;
  classId?: string | null;
  answers?: StudentAnswer[] | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};
