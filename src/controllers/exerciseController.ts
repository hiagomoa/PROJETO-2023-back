import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createExercise = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      dueDate,
      html,
      professorId,
      classId,
      maxAttempts,
    } = req.body;

    const createdExercise = await prisma.exercise.create({
      data: {
        name,
        description,
        dueDate,
        html,
        professorId,
        classId,
        maxAttempts: Number(maxAttempts),
      },
    });

    return res.status(201).json(createdExercise);
  } catch (error) {
    console.error("Erro ao criar o exercício:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const getExerciseById = async (req: Request, res: Response) => {
  try {
    const exerciseId = req.params.id;

    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId, deleted_at: null },
    });

    if (!exercise) {
      return res.status(404).json({ error: "Exercício não encontrado." });
    }

    return res.status(200).json(exercise);
  } catch (error) {
    console.error("Erro ao buscar o exercício pelo ID:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const listExercises = async (req: Request, res: Response) => {
  try {
    const userId = req.query.id;
    const userRole = req.query.role;

    const page = parseInt(req.query.page as string) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage as string) || 10;
    const skip = (page - 1) * itemsPerPage;
    const classId = req.query.classId as string;

    let filter: {
      deleted_at?: Date | null;
      classId?: string;
      professorId?: string;
    } = {
      deleted_at: null,
    };

    if (userRole === "PROFESSOR") {
      filter = {
        ...filter,
        professorId: String(userId),
      };
    } else if (userRole === "STUDENT") {
      const student = await prisma.student.findUnique({
        where: {
          id: String(userId),
        },
      });

      filter = {
        ...filter,
        classId: String(student?.classId),
      };
    }

    if (classId) {
      filter.classId = classId;
    }

    const data = await prisma.exercise.findMany({
      where: filter,
      orderBy: {
        updated_at: "desc",
      },
      skip,
      take: itemsPerPage,
    });

    const total = await prisma.exercise.count({
      where: filter,
    });

    const totalPages = Math.ceil(total / itemsPerPage);
    return res.status(200).json({ total, totalPages, currentPage: page, data });
  } catch (error) {
    console.error("Erro ao listar os exercícios:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const updateExercise = async (req: Request, res: Response) => {
  try {
    const exerciseId = req.params.id;
    const { name, description, dueDate, html, professorId, classId } = req.body;

    const updatedExercise = await prisma.exercise.update({
      where: { id: exerciseId, deleted_at: null },
      data: {
        name,
        description,
        dueDate,
        html,
        professorId,
        classId,
      },
    });

    return res.status(200).json(updatedExercise);
  } catch (error) {
    console.error("Erro ao atualizar o exercício:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const deleteExercise = async (req: Request, res: Response) => {
  try {
    const exerciseId = req.params.id;

    await prisma.exercise.update({
      where: { id: exerciseId },
      data: {
        deleted_at: new Date(),
      },
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao excluir o exercício:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};
