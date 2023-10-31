export type Administrator = {
  id: string;
  name?: string | null;
  password: string;
  email: string;
  role: "ADMIN" | "STUDENT" | "PROFESSOR";
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
};
