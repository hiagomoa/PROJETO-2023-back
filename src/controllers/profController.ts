import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const createProfessor = async (req: Request, res: Response) => {
  try {
    const { name, email, password, administratorId } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingAdmin = await prisma.administrator.findFirst({
      where: {
        email: email,
      },
    });

    const existingStudent = await prisma.student.findFirst({
      where: {
        email: email,
      },
    });

    if (existingAdmin || existingStudent) {
      return res
        .status(400)
        .json({
          error: "Este e-mail já está em uso por um administrador ou aluno.",
        });
    }

    const newProfessor = await prisma.professor.create({
      data: {
        name,
        email,
        password: hashedPassword,
        administratorId,
      },
    });

    return res.status(201).json(newProfessor);
  } catch (error) {
    console.error("Erro ao criar um professor:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const getProfessorById = async (req: Request, res: Response) => {
  try {
    const professorId = req.params.id;

    const professor = await prisma.professor.findUnique({
      where: { id: professorId, deleted_at: null },
    });

    if (!professor) {
      return res.status(404).json({ error: "Professor não encontrado." });
    }

    return res.status(200).json(professor);
  } catch (error) {
    console.error("Erro ao obter informações do professor:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const listProfessors = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage as string) || 10;
    const skip = (page - 1) * itemsPerPage;

    const data = await prisma.professor.findMany({
      where: { deleted_at: null },
      orderBy: {
        updated_at: "desc",
      },
      skip,
      take: itemsPerPage,
    });

    const total = await prisma.professor.count({
      where: { deleted_at: null },
    });
    const totalPages = Math.ceil(total / itemsPerPage);
    return res.status(200).json({ total, totalPages, currentPage: page, data });
  } catch (error) {
    console.error("Erro ao listar professores:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  } finally {
    await prisma.$disconnect();
  }
};

export const updateProfessor = async (req: Request, res: Response) => {
  try {
    const professorId = req.params.id;
    const updates = req.body;

    const existingProfessor = await prisma.professor.findUnique({
      where: { id: professorId, deleted_at: null },
    });

    if (!existingProfessor) {
      return res.status(404).json({ error: "Professor não encontrado." });
    }

    const data: {
      name?: string;
      password?: string;
    } = {};

    if (updates.name) {
      data.name = updates.name;
    }

    if (updates.password) {
      const hashedPassword = await bcrypt.hash(updates.password, 10);
      data.password = hashedPassword;
    }

    const updatedProfessor = await prisma.professor.update({
      where: { id: professorId, deleted_at: null },
      data,
    });

    return res.status(200).json(updatedProfessor);
  } catch (error) {
    console.error("Erro ao atualizar o professor:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const deleteProfessor = async (req: Request, res: Response) => {
  try {
    const professorId = req.params.id;

    await prisma.professor.update({
      where: { id: professorId },
      data: {
        deleted_at: new Date(),
      },
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar o professor:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};
