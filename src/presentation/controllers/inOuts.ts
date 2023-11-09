import { Request, Response } from "express";
import { InOutsService } from "../../data/services/inOuts";

export class InOutsController {
  constructor(private readonly inOutsService: InOutsService) {}

  async getAllByExercise(req: Request, res: Response): Promise<Response<any>> {
    try {
      const id = req.params.id;
      if (!id) throw new Error("Id não informado");
      const svc = await this.inOutsService.getAllByExercise(id);
      return res.send(svc);
    } catch (err) {
      return res.status(400).send({ error: "Erro ao buscar exercício" });
    }
  }
}
