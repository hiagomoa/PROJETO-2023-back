import { Request, Response } from "express";
import { Class } from "../../domain/entities/class";
import { ClassUseCases } from "./../../domain/useCases/class";

export class ClassController {
  constructor(private readonly service: ClassUseCases) {}
  async create(req: Request, res: Response): Promise<Response<string>> {
    try {
      const { name, professorId }: { name: string; professorId: string } =
        req.body;
      if (!name) throw new Error("Nome da classe não informado");
      if (!professorId) throw new Error("Id do professor não informado");
      await this.service.create(name, professorId);

      return res.send("Classe criada com sucesso");
    } catch (err) {
      return res.status(400).send({ error: "Erro ao criar a classe" });
    }
  }
  async getById(req: Request, res: Response): Promise<Response<Class>> {
    try {
      const { id }: { id?: string } = req.params;
      if (!id) throw new Error("Id não informado");
      const svc = await this.service.getById(id);
      return res.send(svc);
    } catch (err) {
      return res.status(400).send({ error: "Erro ao buscar classe" });
    }
  }
  async listClasses(req: Request, res: Response): Promise<Response<Class[]>> {
    try {
      const svc = await this.service.listClasses(
        req.query as { id?: string; role?: string }
      );
      return res.send(svc);
    } catch (err) {
      return res.status(400).send({ error: "Erro ao listar classes" });
    }
  }
  async updateClass(req: Request, res: Response): Promise<Response<string>> {
    try {
      const classId = req.params.id;
      const { name, professorId } = req.body;
      await this.service.updateClass(classId, {
        name,
        professorId,
      });

      return res.send("Classe atualizada com sucesso");
    } catch (err) {
      return res.send({ error: "Erro ao atualizar classe" });
    }
  }
  async deleteClass(req: Request, res: Response): Promise<Response<void>> {
    try {
      const classId = req.params.id;
      await this.service.deleteClass(classId);
      return res.send("Classe deletada com sucesso");
    } catch (err) {
      return res.status(400).send({ error: "Erro ao deletar classe" });
    }
  }
}
