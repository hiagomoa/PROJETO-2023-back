import { Router } from "express";
import { InOutsService } from "../data/services/inOuts";
import { prisma } from "../infra/databases/postgres";
import { InOutsRepository } from "../infra/repositories/inOuts";
import { InOutsController } from "../presentation/controllers/inOuts";

export const InOutsRoutes = Router();

const repo = new InOutsRepository(prisma);
const service = new InOutsService(repo);
const controller = new InOutsController(service);

InOutsRoutes.get(
  "/:id",
  async (req, res) => await controller.getAllByExercise(req, res)
);
