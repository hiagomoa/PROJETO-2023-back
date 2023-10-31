import { Router } from "express";
import { AuthService } from "../data/services/auth";
import { prisma } from "../infra/databases/postgres";
import { AuthRepo } from "../infra/repositories/auth";
import { AuthController } from "../presentation/controllers/auth";

export const AuthRoutes = Router();
const repo = new AuthRepo(prisma);

const service = new AuthService(repo);

const controller = new AuthController(service);

AuthRoutes.post("/login", async (req, res) => await controller.sign(req, res));
AuthRoutes.post(
  "/refresh",
  async (req, res) => await controller.refresh(req, res)
);
