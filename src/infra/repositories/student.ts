import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Student } from "../../domain/entities/student";
import { emailTemplateFolder } from "../../server";
import { sendEmail } from "../../shared/providers/emailService/sendEmail";
import { generateRandomPassword } from "../../utils/auth";
import { StudentRepository } from "./../../data/contracts/repositories/student";

export class StudentRepo implements StudentRepository {
  constructor(private readonly db: PrismaClient) {}
  async create(student: {
    name: string;
    email: string;
    professorId: string;
    classId: string;
    ra: string;
  }): Promise<void> {
    const { classId, email, name, professorId, ra } = student;
    let password;

    const checkIfAlreadyExistUser = await this.db.student.findFirst({
      where: {
        email: email,
        classId: classId,
      },
    });

    if (checkIfAlreadyExistUser) {
      throw new Error("Já existe um Estudante com este email nesta turma!");
    }
    const existingAdmin = await this.db.administrator.findFirst({
      where: {
        email: email,
      },
    });

    const existingProfessor = await this.db.professor.findFirst({
      where: {
        email: email,
      },
    });

    const checkTeacher = await this.db.professor.findUnique({
      where: {
        id: professorId,
      },
    });

    if (!checkTeacher) {
      throw new Error("Não existe um Professor com este ID");
    }

    const checkClass = await this.db.class.findUnique({
      where: {
        id: classId,
      },
    });

    if (!checkClass) {
      throw new Error("Não existe uma Class com este ID");
    }

    if (existingAdmin || existingProfessor) {
      throw new Error(
        "Este e-mail já está em uso por um administrador ou professor."
      );
    }
    if (!password) {
      password = generateRandomPassword();
      sendEmail({
        body: {
          userName: name,
          password,
        },
        emailTemplatePath: `${emailTemplateFolder}/create-password-template.hbs`,
        from: process.env.EMAIL_FROM as string,
        subject: "Nova Password",
        to: email,
      });
      password = await bcrypt.hash(password, 10);
    } else {
      password = await bcrypt.hash(password, 10);
    }

    const db = await this.db.student.create({
      data: {
        name: student.name,
        email: student.email,
        password: password,
        ra: student.ra,
        professorId: student.professorId,
        classId: student.classId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    if (!db) {
      throw new Error("Erro ao criar estudante");
    }
  }
  async getById(id: string): Promise<Student> {
    const db = await this.db.student.findUnique({
      where: { id },
    });

    if (!db) {
      throw new Error("Estudante não encontrado");
    }
    return db;
  }
  async listStudents(
    id?: string | null,
    role?: string | null
  ): Promise<Student[]> {
    let filter: {
      deleted_at?: Date | null;
      professorId?: string;
    } = {
      deleted_at: null,
    };

    if (role === "PROFESSOR") {
      filter = {
        ...filter,
        professorId: String(id),
      };
    }

    const db = await this.db.student.findMany({
      where: filter,
      orderBy: {
        updated_at: "desc",
      },
    });

    if (!db) {
      throw new Error("Erro ao listar estudantes");
    }
    return db.map((student) => ({
      id: student.id,
      name: student.name,
      email: student.email,
      password: student.password,
      created_at: student.created_at,
      updated_at: student.updated_at,
      deleted_at: student.deleted_at,
      role: student.role,
      ra: student.ra,
      professorId: student.professorId,
      classId: student.classId,
    }));
  }
  async updateStudent(
    id: string,
    student: {
      name: string;
      email: string;
      password: string;
      professorId: string;
      classId: string;
      ra: string;
    }
  ): Promise<void> {
    const db = await this.db.student.update({
      where: { id },
      data: {
        name: student.name,
        email: student.email,
        password: student.password,
        ra: student.ra,
        professorId: student.professorId,
        classId: student.classId,
      },
    });

    if (!db) {
      throw new Error("Erro ao atualizar estudante");
    }
  }
  async deleteStudent(id: string): Promise<void> {
    const db = await this.db.student.update({
      where: { id },
      data: { deleted_at: new Date() },
    });

    if (!db) {
      throw new Error("Erro ao deletar estudante");
    }
  }
}
