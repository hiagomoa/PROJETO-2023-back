export type AlunosItensInOut = {
  id: string;
  studentId: string;
  exerciseId: string;
  testNumber?: string | null;
  answer: string;
};

export type AlunosItensInOutWIthAttempts = {
  inOut: AlunosItensInOut[];
  attempts?: number | null;
};
