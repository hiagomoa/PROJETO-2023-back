import { Router } from "express";
import { ExerciseService } from "../data/services/exercise";
import { prisma } from "../infra/databases/postgres";
import { ExerciseRepo } from "../infra/repositories/exercise";
import { ExerciseController } from "../presentation/controllers/exerciseController";

export const ExercisesRoutes = Router();

const repo = new ExerciseRepo(prisma);
const service = new ExerciseService(repo);
const controller = new ExerciseController(service);

ExercisesRoutes.post(
  "/",
  async (req, res) => await controller.create(req, res)
);
ExercisesRoutes.get(
  "/:id",
  async (req, res) => await controller.getById(req, res)
);
ExercisesRoutes.get(
  "/",
  async (req, res) => await controller.listExercises(req, res)
);
ExercisesRoutes.get(
  "/get-users-by-exc/:id",
  async (req, res) => await controller.getByUsers(req, res)
);
ExercisesRoutes.put(
  "/:id",
  async (req, res) => await controller.updateExercise(req, res)
);
ExercisesRoutes.delete(
  "/:id",
  async (req, res) => await controller.deleteExercise(req, res)
);
