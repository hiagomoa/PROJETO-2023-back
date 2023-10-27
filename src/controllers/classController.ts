import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const createClass = async (req: Request, res: Response) => {
  try {
    const { name, professorId } = req.body;

    const checkTeacher = await prisma.professor.findUnique({
      where: {
        id: professorId,
      },
    });

    if (!checkTeacher) {
      return res
        .status(400)
        .json({ error: "Não existe um professor com esse ID" });
    }

    const createdClass = await prisma.class.create({
      data: {
        name,
        professorId,
      },
    });

    return res.status(201).json(createdClass);
  } catch (error) {
    console.error("Erro ao criar a classe:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const getClassById = async (req: Request, res: Response) => {
  try {
    const classId = req.params.id;

    const classItem = await prisma.class.findUnique({
      where: { id: classId, deleted_at: null },
      include: {
        students: true,
      },
    });

    if (!classItem) {
      return res.status(404).json({ error: "Classe não encontrada." });
    }

    return res.status(200).json(classItem);
  } catch (error) {
    console.error("Erro ao buscar a classe pelo ID:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const listClasses = async (req: Request, res: Response) => {
  try {
    const userId = req.query.id;
    const userRole = req.query.role;
    const page = parseInt(req.query.page as string) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage as string) || 10;
    const skip = (page - 1) * itemsPerPage;

    let filter: {
      deleted_at?: Date | null;
      professorId?: string;
      id?: string;
    } = {
      deleted_at: null,
    };

    if (userRole === "PROFESSOR") {
      filter = {
        ...filter,
        professorId: String(userId),
      };
    }

    if (userRole === "STUDENT") {
      const student = await prisma.student.findUnique({
        where: {
          id: String(userId),
        },
      });

      filter = {
        ...filter,
        id: String(student?.classId),
      };
    }

    const data = await prisma.class.findMany({
      where: filter,
      orderBy: {
        updated_at: "desc",
      },
      skip,
      take: itemsPerPage,
    });

    const total = await prisma.class.count({
      where: { deleted_at: null },
    });

    const totalPages = Math.ceil(total / itemsPerPage);
    return res.status(200).json({ total, totalPages, currentPage: page, data });
  } catch (error) {
    console.error("Erro ao listar as classes:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const updateClass = async (req: Request, res: Response) => {
  try {
    const classId = req.params.id;
    const { name, professorId } = req.body;

    const updatedClass = await prisma.class.update({
      where: { id: classId, deleted_at: null },
      data: {
        name,
        professorId,
      },
    });

    return res.status(200).json(updatedClass);
  } catch (error) {
    console.error("Erro ao atualizar a classe:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const deleteClass = async (req: Request, res: Response) => {
  try {
    const classId = req.params.id;

    await prisma.class.update({
      where: { id: classId },
      data: {
        deleted_at: new Date(),
      },
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao excluir a classe:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};
