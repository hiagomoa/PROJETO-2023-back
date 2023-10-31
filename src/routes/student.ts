import { Router } from "express";
import { StudentService } from "../data/services/student";
import { prisma } from "../infra/databases/postgres";
import { StudentRepo } from "../infra/repositories/student";
import { StudentController } from "../presentation/controllers/studentController";

export const StudentRoutes = Router();

const repo = new StudentRepo(prisma);
const service = new StudentService(repo);
const controller = new StudentController(service);

StudentRoutes.post("/", async (req, res) => await controller.create(req, res));
StudentRoutes.get(
  "/:id",
  async (req, res) => await controller.getById(req, res)
);
StudentRoutes.get(
  "/",
  async (req, res) => await controller.listStudents(req, res)
);
StudentRoutes.put(
  "/:id",
  async (req, res) => await controller.updateStudent(req, res)
);
StudentRoutes.delete(
  "/:id",
  async (req, res) => await controller.deleteStudent(req, res)
);
