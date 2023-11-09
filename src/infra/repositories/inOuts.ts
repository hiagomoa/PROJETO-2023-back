import { PrismaClient } from "@prisma/client";

export class InOutsRepository {
  constructor(private readonly db: PrismaClient) {}

  async getAllByExercise(exercise: string): Promise<any> {
    return await this.db.alunoItensInOut.findMany({
      where: {
        exerciseId: exercise,
        answer: {
          equals: "OK",
        },
      },
    });
  }
}
