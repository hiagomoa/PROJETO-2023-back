import { InOutsRepository } from "../../infra/repositories/inOuts";

export class InOutsService {
  constructor(private readonly repo: InOutsRepository) {}

  async getAllByExercise(exercise: string): Promise<any> {
    return await this.repo.getAllByExercise(exercise);
  }
}
