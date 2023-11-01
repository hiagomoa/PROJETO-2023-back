export type Teacher = {
  id: string;
  name?: string | null;
  email: string;
  password: string;
  role: "STUDENT" | "PROFESSOR" | "ADMIN";
  administratorId: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
};
