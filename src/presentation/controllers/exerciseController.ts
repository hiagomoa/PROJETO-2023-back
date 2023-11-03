import { Request, Response } from "express";
import { Exercise } from "../../domain/entities/exercise";
import { StudentAnswer } from "../../domain/entities/studentAnswer";
import { ExerciseUseCases } from "../../domain/useCases/exercise";

export class ExerciseController {
  constructor(private readonly service: ExerciseUseCases) {}
  async create(req: Request, res: Response): Promise<Response<Exercise>> {
    try {
      const {
        name,
        description,
        dueDate,
        html,
        professorId,
        classId,
        maxAttempts,
      } = req.body;

      const exercise = await this.service.create({
        name,
        description,
        dueDate,
        html,
        professorId,
        classId,
        maxAttempts: Number(maxAttempts),
      });

      return res.status(201).json({ id: exercise });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao criar exercício" });
    }
  }

  async getById(req: Request, res: Response): Promise<Response<Exercise>> {
    try {
      const id = req.params.id;
      if (!id) throw new Error("Id não informado");
      const svc = await this.service.getById(id);
      return res.send(svc);
    } catch (err) {
      return res.status(400).send({ error: "Erro ao buscar exercício" });
    }
  }

  async listExercises(
    req: Request,
    res: Response
  ): Promise<Response<Exercise[]>> {
    try {
      const svc = await this.service.listExercises(
        req.query as { id?: string; role?: string; classId?: string }
      );
      return res.send(svc);
    } catch (err) {
      return res.status(400).send({ error: "Erro ao listar exercícios" });
    }
  }
  async getByUsers(
    req: Request,
    res: Response
  ): Promise<Response<StudentAnswer[]>> {
    try {
      const id = req.params.id;

      const svc = await this.service.getByUsers(id);
      return res.send(svc);
    } catch (err) {
      return res.status(400).send({ error: "Erro ao listar exercícios" });
    }
  }
  async updateExercise(req: Request, res: Response): Promise<Response<void>> {
    try {
      const { name, description, dueDate, html, professorId, classId } =
        req.body;

      const exerciseId = req.params.id;

      await this.service.updateExercise(exerciseId, {
        name,
        description,
        dueDate,
        html,
        professorId,
        classId,
      });

      return res.send("Exercício atualizado com sucesso");
    } catch (err) {
      return res.status(400).send({ error: "Erro ao atualizar exercício" });
    }
  }
  async deleteExercise(req: Request, res: Response): Promise<Response<void>> {
    try {
      const exerciseId = req.params.id;
      await this.service.deleteExercise(exerciseId);
      return res.send("Exercício deletado com sucesso");
    } catch (err) {
      return res.status(400).send({ error: "Erro ao deletar exercício" });
    }
  }
}
