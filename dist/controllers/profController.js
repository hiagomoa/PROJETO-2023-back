"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProfessor = exports.updateProfessor = exports.listProfessors = exports.getProfessorById = exports.createProfessor = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const createProfessor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, administratorId } = req.body;
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const existingAdmin = yield prisma.administrator.findFirst({
            where: {
                email: email,
            },
        });
        const existingStudent = yield prisma.student.findFirst({
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
        const newProfessor = yield prisma.professor.create({
            data: {
                name,
                email,
                password: hashedPassword,
                administratorId,
            },
        });
        return res.status(201).json(newProfessor);
    }
    catch (error) {
        console.error("Erro ao criar um professor:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});
exports.createProfessor = createProfessor;
const getProfessorById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const professorId = req.params.id;
        const professor = yield prisma.professor.findUnique({
            where: { id: professorId, deleted_at: null },
        });
        if (!professor) {
            return res.status(404).json({ error: "Professor não encontrado." });
        }
        return res.status(200).json(professor);
    }
    catch (error) {
        console.error("Erro ao obter informações do professor:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});
exports.getProfessorById = getProfessorById;
const listProfessors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
        const skip = (page - 1) * itemsPerPage;
        const data = yield prisma.professor.findMany({
            where: { deleted_at: null },
            orderBy: {
                updated_at: "desc",
            },
            skip,
            take: itemsPerPage,
        });
        const total = yield prisma.professor.count({
            where: { deleted_at: null },
        });
        const totalPages = Math.ceil(total / itemsPerPage);
        return res.status(200).json({ total, totalPages, currentPage: page, data });
    }
    catch (error) {
        console.error("Erro ao listar professores:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.listProfessors = listProfessors;
const updateProfessor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const professorId = req.params.id;
        const updates = req.body;
        const existingProfessor = yield prisma.professor.findUnique({
            where: { id: professorId, deleted_at: null },
        });
        if (!existingProfessor) {
            return res.status(404).json({ error: "Professor não encontrado." });
        }
        const data = {};
        if (updates.name) {
            data.name = updates.name;
        }
        if (updates.password) {
            const hashedPassword = yield bcrypt_1.default.hash(updates.password, 10);
            data.password = hashedPassword;
        }
        const updatedProfessor = yield prisma.professor.update({
            where: { id: professorId, deleted_at: null },
            data,
        });
        return res.status(200).json(updatedProfessor);
    }
    catch (error) {
        console.error("Erro ao atualizar o professor:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});
exports.updateProfessor = updateProfessor;
const deleteProfessor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const professorId = req.params.id;
        yield prisma.professor.update({
            where: { id: professorId },
            data: {
                deleted_at: new Date(),
            },
        });
        return res.status(204).send();
    }
    catch (error) {
        console.error("Erro ao deletar o professor:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});
exports.deleteProfessor = deleteProfessor;
