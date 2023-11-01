import { Router } from "express";
import { TeacherService } from "../data/services/teacher";
import { prisma } from "../infra/databases/postgres";
import { TeacherRepo } from "../infra/repositories/teacher";
import { TeacherController } from "../presentation/controllers/teacherController";

export const TeacherRoutes = Router();
const repo = new TeacherRepo(prisma);
const service = new TeacherService(repo);
const controller = new TeacherController(service);

TeacherRoutes.post("/", async (req, res) => await controller.create(req, res));
TeacherRoutes.get(
  "/:id",
  async (req, res) => await controller.getById(req, res)
);
TeacherRoutes.get(
  "/",
  async (req, res) => await controller.listTeachers(req, res)
);
TeacherRoutes.put(
  "/:id",
  async (req, res) => await controller.updateTeacher(req, res)
);
TeacherRoutes.delete(
  "/:id",
  async (req, res) => await controller.deleteTeacher(req, res)
);
