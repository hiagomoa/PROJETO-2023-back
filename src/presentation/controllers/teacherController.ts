import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { Teacher } from "../../domain/entities/teacher";
import { TeacherUseCases } from "../../domain/useCases/teacher";

export class TeacherController {
  constructor(private readonly service: TeacherUseCases) {}
  async create(req: Request, res: Response): Promise<Response<void>> {
    try {
      const { name, email, password, administratorId } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      await this.service.create({
        name,
        email,
        password: hashedPassword,
        administratorId,
      });

      return res.send("Professor criado com sucesso");
    } catch (err) {
      return res.send("Erro ao criar professor");
    }
  }
  async getById(req: Request, res: Response): Promise<Response<Teacher>> {
    try {
      const id = req.params.id;

      const service = await this.service.getById(id);

      return res.send(service);
    } catch (err) {
      return res.send("Erro ao buscar professor");
    }
  }
  async listTeachers(
    req: Request,
    res: Response
  ): Promise<Response<Teacher[]>> {
    try {
      const service = await this.service.listTeachers();

      return res.send(service);
    } catch (err) {
      return res.send("Erro ao listar professores");
    }
  }
  async updateTeacher(req: Request, res: Response): Promise<Response<void>> {
    try {
      const id = req.params.id;
      const { name, password } = req.body;

      await this.service.updateTeacher(id, {
        name,
        password,
      });

      return res.send("Professor atualizado com sucesso");
    } catch (err) {
      return res.send("Erro ao atualizar professor");
    }
  }
  async deleteTeacher(req: Request, res: Response): Promise<Response<void>> {
    try {
      const id = req.params.id;

      console.log(id);

      await this.service.deleteTeacher(id);

      return res.send("Professor deletado com sucesso");
    } catch (err) {
      return res.send("Erro ao deletar professor");
    }
  }
}
