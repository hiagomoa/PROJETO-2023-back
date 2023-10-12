import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createStudentAnswer = async (req: Request, res: Response) => {
  try {
    const { studentId, exerciseId, answer, attempts} = req.body;

    const createdStudentAnswer = await prisma.studentAnswer.create({
      data: {
        studentId,
        exerciseId,
        answer,
        attempts
      },
    });

    return res.status(201).json(createdStudentAnswer);
  } catch (error) {
    console.error("Erro ao criar a resposta do estudante:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const getStudentAnswerById = async (req: Request, res: Response) => {
  try {
    const studentAnswerId = req.params.id;

    const studentAnswer = await prisma.studentAnswer.findUnique({
      where: { id: studentAnswerId },
    });

    if (!studentAnswer) {
      return res
        .status(404)
        .json({ error: "Resposta do estudante não encontrada." });
    }

    return res.status(200).json(studentAnswer);
  } catch (error) {
    console.error("Erro ao buscar a resposta do estudante:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const listStudentAnswers = async (req: Request, res: Response) => {
  try {
    const studentAnswers = await prisma.studentAnswer.findMany();

    return res.status(200).json(studentAnswers);
  } catch (error) {
    console.error("Erro ao listar as respostas dos estudantes:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const updateStudentAnswer = async (req: Request, res: Response) => {
  try {
    const studentAnswerId = req.params.id;
    const { studentId, exerciseId, answer } = req.body;

    const updatedStudentAnswer = await prisma.studentAnswer.update({
      where: { id: studentAnswerId },
      data: {
        studentId,
        exerciseId,
        answer,
      },
    });

    return res.status(200).json(updatedStudentAnswer);
  } catch (error) {
    console.error("Erro ao atualizar a resposta do estudante:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const deleteStudentAnswer = async (req: Request, res: Response) => {
  try {
    const studentAnswerId = req.params.id;

    await prisma.studentAnswer.update({
      where: { id: studentAnswerId },
      data: {
        deleted_at: new Date(),
      },
    });
    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao excluir a resposta do estudante:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};
