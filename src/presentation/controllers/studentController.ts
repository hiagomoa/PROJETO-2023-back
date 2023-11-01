import { Request, Response } from "express";
import { Student } from "../../domain/entities/student";
import { StudentUseCases } from "../../domain/useCases/student";

export class StudentController {
  constructor(private readonly service: StudentUseCases) {}
  async create(req: Request, res: Response): Promise<Response<void>> {
    try {
      const { name, email, professorId, classId, ra } = req.body;

      await this.service.create({
        name,
        email,
        professorId,
        classId,
        ra,
      });

      return res.send("Estudante criado com sucesso");
    } catch (err) {
      return res.status(400).send({ error: "Erro ao criar o estudante" });
    }
  }
  async getById(req: Request, res: Response): Promise<Response<Student>> {
    try {
      const id = req.params.id;

      const service = await this.service.getById(id);

      return res.send(service);
    } catch (err) {
      return res.status(500).send({ error: "Erro ao buscar o estudante" });
    }
  }
  async listStudents(
    req: Request,
    res: Response
  ): Promise<Response<Student[]>> {
    try {
      const userId = req.query.id;
      const userRole = req.query.role;

      let data: { id?: string | null; role?: string | null } = {
        id: String(userId),
        role: String(userRole),
      };

      const service = await this.service.listStudents(data);

      return res.send(service);
    } catch (err) {
      return res.send("Erro ao listar estudantes");
    }
  }
  async updateStudent(req: Request, res: Response): Promise<Response<void>> {
    try {
      const { name, email, password, professorId, classId, ra } = req.body;

      const id = req.params.id;

      await this.service.updateStudent(id, {
        name,
        email,
        password,
        professorId,
        classId,
        ra,
      });

      return res.send("Estudante atualizado com sucesso");
    } catch (err) {
      return res.status(500).send({ error: "Erro ao atualizar o estudante" });
    }
  }
  async deleteStudent(req: Request, res: Response): Promise<Response<void>> {
    try {
      const id = req.params.id;

      await this.service.deleteStudent(id);

      return res.send("Estudante deletado com sucesso");
    } catch (err) {
      return res.status(500).send({ error: "Erro ao deletar o estudante" });
    }
  }
}
