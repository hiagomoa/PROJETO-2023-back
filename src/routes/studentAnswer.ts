import { Router } from "express";
import { StudentAnswerService } from "../data/services/studentAnswer";
import { prisma } from "../infra/databases/postgres";
import { StudentAnswerRepo } from "../infra/repositories/studentAnswers";
import { AnswerController } from "../presentation/controllers/answerController";

export const StudentAnswerRoutes = Router();
const repo = new StudentAnswerRepo(prisma);
const service = new StudentAnswerService(repo);
const controller = new AnswerController(service);
StudentAnswerRoutes.post(
  "/",
  async (req, res) => await controller.create(req, res)
);
StudentAnswerRoutes.post(
  "/out-put",
  async (req, res) => await controller.getAnswerOutPut(req, res)
);
StudentAnswerRoutes.get(
  "/:id",
  async (req, res) => await controller.getById(req, res)
);
StudentAnswerRoutes.get(
  "/by-exercise/:id",
  async (req, res) => await controller.getByExercise(req, res)
);
StudentAnswerRoutes.get(
  "/",
  async (req, res) => await controller.listStudentAnswers(req, res)
);
StudentAnswerRoutes.put(
  "/:id",
  async (req, res) => await controller.updateStudentAnswer(req, res)
);
StudentAnswerRoutes.delete(
  "/:id",
  async (req, res) => await controller.deleteStudentAnswer(req, res)
);
