import { Request, Response } from "express";
import { AdminContract } from "../../data/contracts/entities";
import { AdminService } from "../../data/services/admin";

export class AdminController {
  constructor(private readonly serve: AdminService) {}
  async create(req: Request, res: Response): Promise<Response<AdminContract>> {
    const {
      name,
      email,
      password,
    }: { name: string; email: string; password: string } = req.body;

    try {
      const service = await this.serve.create(name, email, password);
      return res.send({ data: service });
    } catch (err) {
      return res.send({ error: "Erro ao criar administrador" });
    }
  }
  async getById(req: Request, res: Response): Promise<Response<AdminContract>> {
    const { id }: { id?: string } = req.params;

    if (!id) return res.status(400).send({ error: "Id não informado" });

    try {
      const svc = await this.serve.getById(id);

      return res.send(svc);
    } catch (err) {
      return res.status(404).send({ error: "Administrador não encontrado" });
    }
  }
  async listAdmins(
    req: Request,
    res: Response
  ): Promise<Response<AdminContract[]>> {
    try {
      const svc = await this.serve.listAdmins();
      return res.send(svc);
    } catch (err) {
      return res.status(500).send({ error: "Erro interno do servidor" });
    }
  }
  async updateAdmin(req: Request, res: Response): Promise<Response<string>> {
    const { id }: { id?: string } = req.params;
    const admin: AdminContract = req.body;

    if (!id) return res.status(400).send({ error: "Id não informado" });
    if (!admin) return res.status(400).send({ error: "Dados não informados" });

    try {
      const svc = await this.serve.updateAdmin(id, admin);
      return res.send(svc);
    } catch (err) {
      return res.status(500).send({ error: "Erro interno do servidor" });
    }
  }
  async deleteAdmin(req: Request, res: Response): Promise<string | void> {
    const { id }: { id?: string } = req.params;
    if (!id) return "Id não informado";

    try {
      const svc = await this.serve.deleteAdmin(id);
      return svc;
    } catch (err) {
      return "Erro interno do servidor";
    }
  }
}
