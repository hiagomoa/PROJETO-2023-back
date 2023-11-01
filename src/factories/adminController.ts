import { PrismaClient } from "@prisma/client";
import { AdminService } from "../data/services/admin";
import { AdminRepo } from "../infra/repositories/admin";
import { AdminController } from "../presentation/controllers/admin";

export const makeAdminController = (): AdminController => {
  const prisma = new PrismaClient();
  const repo = new AdminRepo(prisma);
  console.log(repo, "repo");
  const service = new AdminService(repo);
  console.log(service, "service");
  return new AdminController(service);
};
