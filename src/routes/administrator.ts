import express from "express";
import { AdminService } from "../data/services/admin";
import { prisma } from "../infra/databases/postgres";
import { AdminRepo } from "../infra/repositories/admin";
import { AdminController } from "../presentation/controllers/admin";

export const AdminRoutes = express.Router();

const repo = new AdminRepo(prisma);
const service = new AdminService(repo);
const controller = new AdminController(service);

AdminRoutes.post("/", async (req, res) => await controller.create(req, res));
AdminRoutes.get("/:id", async (req, res) => await controller.getById(req, res));
AdminRoutes.get("/", async (req, res) => await controller.listAdmins(req, res));
AdminRoutes.put(
  "/:id",
  async (req, res) => await controller.updateAdmin(req, res)
);
AdminRoutes.delete(
  "/:id",
  async (req, res) => await controller.deleteAdmin(req, res)
);
