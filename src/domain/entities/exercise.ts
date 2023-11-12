export type Exercise = {
  id: string;
  name: string;
  description?: string | null;
  dueDate: Date;
  html?: string | null;
  report?: string | null;
  maxAttempts?: number | null;
  professorId: string;
  classId: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
};
