import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateRandomPassword } from "../utils/auth";
import { sendEmail } from "../shared/providers/emailService/sendEmail";
import { emailTemplateFolder } from "../server";

const prisma = new PrismaClient();

export const createStudent = async (req: Request, res: Response) => {
  try {
    let { name, email, password, professorId, classId, ra } = req.body;

    const checkIfAlreadyExistUser = await prisma.student.findFirst({
      where: {
        email: email, 
      },
    });

    if(checkIfAlreadyExistUser) {
      return res.status(400).json({error : "Já existe um Estudante com este email"})
    }
    const existingAdmin = await prisma.administrator.findFirst({
      where: {
        email: email, 
      },
    });

    

    const existingProfessor = await prisma.professor.findFirst({
      where: {
        email: email,
      },
    });

    const checkTeacher = await prisma.professor.findUnique({
      where: {
        id: professorId,
      },
    }); 
  
    if(!checkTeacher){
      return res.status(400).json({error : "Não existe um professor com este ID"})
    }

    const checkClass = await prisma.class.findUnique({
      where: {
        id: classId,
      },
    }); 

    if(!checkClass){
      return res.status(400).json({error : "Não existe uma Class com este ID"})
    }
    
    if (existingAdmin || existingProfessor) {
      return res.status(400).json({
        error: "Este e-mail já está em uso por um administrador ou professor.",
      });
    }
    if(!password){
      password = generateRandomPassword()
      sendEmail({
        body: {
          userName: name,
          password,
        },
        emailTemplatePath: `${emailTemplateFolder}/create-password-template.hbs`,
        from: process.env.EMAIL_FROM as string,
        subject: 'Nova Password',
        to: email
      })
      password = await bcrypt.hash(password, 10);
    }else {
      password = await bcrypt.hash(password, 10);

    }
    const createdStudent = await prisma.student.create({
      data: {
        name,
        email,
        password,
        ra,
        professorId,
        classId,
      },
    });

    return res.status(201).json(createdStudent);
  } catch (error) {
    console.error("Erro ao criar o estudante:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.id;
    const { name, email, password, professorId, classId, ra } = req.body;

    // Verifique se o estudante existe
    const existingStudent = await prisma.student.findUnique({
      where: { id: studentId, deleted_at: null },
    });

    if (!existingStudent) {
      return res.status(404).json({ error: "Estudante não encontrado." });
    }

    // Crie um objeto com os campos que serão atualizados
    const updateData: {
      name?: string;
      email?: string;
      password?: string;
      professorId?: string;
      classId?: string;
      ra?: string;
    } = {};

    // Atualize os campos do objeto de atualização com os valores fornecidos na solicitação
    if (name) {
      updateData.name = name;
    }
    if (ra) {
      updateData.ra = ra;
    }

    if (email) {
      updateData.email = email;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    if (professorId) {
      updateData.professorId = professorId;
    }

    if (classId) {
      updateData.classId = classId;
    }

    // Atualize os campos do estudante
    const updatedStudent = await prisma.student.update({
      where: { id: studentId, deleted_at: null },
      data: updateData,
    });

    return res.status(200).json(updatedStudent);
  } catch (error) {
    console.error("Erro ao atualizar o estudante:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.id;

    const student = await prisma.student.findUnique({
      where: { id: studentId, deleted_at: null },
    });

    if (!student) {
      return res.status(404).json({ error: "Estudante não encontrado." });
    }

    return res.status(200).json(student);
  } catch (error) {
    console.error("Erro ao buscar o estudante:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const listStudents = async (req: Request, res: Response) => {
  try {
    const userId = req.query.id;
    const userRole = req.query.role;

    const page = parseInt(req.query.page as string) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage as string) || 10;
    const skip = (page - 1) * itemsPerPage;

    let filter: {
      deleted_at?: Date | null;
      professorId?: string;
    } = {
      deleted_at: null,
    };

    if (userRole === "PROFESSOR") {
      filter = {
        ...filter,
        professorId: String(userId),
      };
    }

    const data = await prisma.student.findMany({
      where: filter,
      orderBy: {
        updated_at: "desc",
      },
      skip,
      take: itemsPerPage,
    });

    const total = await prisma.student.count({
      where: { deleted_at: null },
    });
    const totalPages = Math.ceil(total / itemsPerPage);
    return res.status(200).json({ total, totalPages, currentPage: page, data });
  } catch (error) {
    console.error("Erro ao listar estudantes:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.id;

    await prisma.student.update({
      where: { id: studentId },
      data: {
        deleted_at: new Date(),
      },
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao excluir o estudante:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};
