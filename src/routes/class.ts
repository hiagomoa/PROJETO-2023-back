import { Router } from "express";
import { ClassService } from "../data/services/class";
import { prisma } from "../infra/databases/postgres";
import { ClassRepo } from "../infra/repositories/class";
import { ClassController } from "../presentation/controllers/classController";

export const ClassRoutes = Router();

const repo = new ClassRepo(prisma);

const service = new ClassService(repo);

const controller = new ClassController(service);

ClassRoutes.post("/", async (req, res) => await controller.create(req, res));
ClassRoutes.get("/:id", async (req, res) => await controller.getById(req, res));
ClassRoutes.get(
  "/",
  async (req, res) => await controller.listClasses(req, res)
);
ClassRoutes.put(
  "/:id",
  async (req, res) => await controller.updateClass(req, res)
);
ClassRoutes.delete(
  "/:id",
  async (req, res) => await controller.deleteClass(req, res)
);
