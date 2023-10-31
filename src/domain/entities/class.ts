import { Student } from "./student";

export type Class = {
  id: string;
  name: string;
  professorId?: string | null;
  created_at: Date;
  updated_at: Date;
  students?: Student[];
  deleted_at?: Date | null;
};
