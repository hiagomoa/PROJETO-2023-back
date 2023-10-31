export type StudentAnswer = {
  id: string;
  answer?: string | null;
  attempts?: number | null;
  exerciseId: string;
  studentId: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
  alunoItensInOutId?: any | null;
};
