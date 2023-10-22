import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;

    const existingProfessor = await prisma.professor.findFirst({
      where: {
        email: email,
      },
    });

    const existingStudent = await prisma.student.findFirst({
      where: {
        email: email,
      },
    });

    if (existingProfessor || existingStudent) {
      return res.status(400).json({
        error: "Este e-mail já está em uso por um professor ou aluno.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.administrator.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json(newAdmin);
  } catch (error) {
    console.error("Erro ao criar um administrador:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const getAdminById = async (req: Request, res: Response) => {
  try {
    const adminId = req.params.id;

    const admin = await prisma.administrator.findUnique({
      where: { id: adminId, deleted_at: null },
    });

    if (!admin) {
      return res.status(404).json({ error: "Administrador não encontrado." });
    }
    return res.status(200).json(admin);
  } catch (error) {
    console.error("Erro ao obter informações do administrador:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const listAdmins = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage as string) || 10;
    const skip = (page - 1) * itemsPerPage;

    const data = await prisma.administrator.findMany({
      where: { deleted_at: null },
      include: {
        professors: true,
      },
      orderBy: {
        updated_at: "desc",
      },
      skip,
      take: itemsPerPage,
    });

    const total = await prisma.administrator.count({
      where: { deleted_at: null },
    });

    const totalPages = Math.ceil(total / itemsPerPage);
    return res.status(200).json({ total, totalPages, currentPage: page, data });
  } catch (error) {
    console.error("Erro ao listar administradores:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  } finally {
    await prisma.$disconnect();
  }
};

export const updateAdmin = async (req: Request, res: Response) => {
  try {
    const adminId = req.params.id;
    const updates = req.body;

    const existingAdmin = await prisma.administrator.findUnique({
      where: { id: adminId, deleted_at: null },
    });

    if (!existingAdmin) {
      return res.status(404).json({ error: "Administrador não encontrado." });
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

    const updatedAdmin = await prisma.administrator.update({
      where: { id: adminId },
      data,
    });

    return res.status(200).json(updatedAdmin);
  } catch (error) {
    console.error("Erro ao atualizar o administrador:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const deleteAdmin = async (req: Request, res: Response) => {
  try {
    const adminId = req.params.id;

    const existingAdmin = await prisma.administrator.findUnique({
      where: { id: adminId },
    });

    if (!existingAdmin) {
      return res.status(404).json({ error: "Administrador não encontrado." });
    }

    await prisma.administrator.update({
      where: { id: adminId },
      data: {
        deleted_at: new Date(),
      },
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar o administrador:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};