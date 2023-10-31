import { Request, Response } from "express";
import { StudentAnswer } from "../../domain/entities/studentAnswer";
import { StudentAnswerUseCases } from "../../domain/useCases/studentAnswer";

export class AnswerController {
  constructor(private readonly service: StudentAnswerUseCases) {}
  async create(req: Request, res: Response): Promise<Response<void>> {
    try {
      const { studentId, exerciseId, answer, attempts } = req.body;

      await this.service.create({
        studentId,
        exerciseId,
        answer,
        attempts,
      });

      return res.status(201).json("Resposta do estudante criada com sucesso");
    } catch (err) {
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
  async getById(req: Request, res: Response): Promise<Response<StudentAnswer>> {
    try {
      const studentAnswerId = req.params.id;

      const studentAnswer = await this.service.getById(studentAnswerId);

      if (!studentAnswer) {
        return res
          .status(404)
          .json({ error: "Resposta do estudante não encontrada." });
      }

      return res.status(200).json(studentAnswer);
    } catch (err) {
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
  async listStudentAnswers(
    req: Request,
    res: Response
  ): Promise<Response<StudentAnswer[]>> {
    try {
      const studentAnswers = await this.service.listStudentAnswers();

      return res.status(200).json(studentAnswers);
    } catch (err) {
      return res.status(500).send("Erro ao listar respostas dos estudantes");
    }
  }
  async getByExercise(
    req: Request,
    res: Response
  ): Promise<Response<StudentAnswer[]>> {
    try {
      const id = req.params.id;

      const studentAnswers = await this.service.getByExercise(id);

      return res.status(200).json(studentAnswers);
    } catch (err) {
      return res.status(500).send("Erro ao listar respostas dos estudantes");
    }
  }
  async updateStudentAnswer(
    req: Request,
    res: Response
  ): Promise<Response<void>> {
    try {
      const studentAnswerId = req.params.id;
      const { studentId, exerciseId, answer } = req.body;

      await this.service.updateStudentAnswer(studentAnswerId, {
        studentId,
        exerciseId,
        answer,
      });

      return res
        .status(200)
        .json("Resposta do estudante atualizada com sucesso");
    } catch (err) {
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
  async deleteStudentAnswer(
    req: Request,
    res: Response
  ): Promise<Response<void>> {
    try {
      const studentAnswerId = req.params.id;

      await this.service.deleteStudentAnswer(studentAnswerId);

      return res.status(200).json("Resposta do estudante deletada com sucesso");
    } catch (err) {
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
  async getAnswerOutPut(
    req: Request,
    res: Response
  ): Promise<Response<StudentAnswer[]>> {
    try {
      const { studentId, exerciseId } = req.body;

      const studentAnswers = await this.service.getAnswerOutPut(
        studentId,
        exerciseId
      );

      return res.status(200).json(studentAnswers);
    } catch (err) {
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
}
