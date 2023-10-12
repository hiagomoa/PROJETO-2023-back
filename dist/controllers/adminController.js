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
exports.deleteAdmin = exports.updateAdmin = exports.listAdmins = exports.getAdminById = exports.createAdmin = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const createAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, password } = req.body;
        const existingProfessor = yield prisma.professor.findFirst({
            where: {
                email: email,
            },
        });
        const existingStudent = yield prisma.student.findFirst({
            where: {
                email: email,
            },
        });
        if (existingProfessor || existingStudent) {
            return res.status(400).json({
                error: "Este e-mail já está em uso por um professor ou aluno.",
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newAdmin = yield prisma.administrator.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        return res.status(201).json(newAdmin);
    }
    catch (error) {
        console.error("Erro ao criar um administrador:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});
exports.createAdmin = createAdmin;
const getAdminById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.params.id;
        const admin = yield prisma.administrator.findUnique({
            where: { id: adminId, deleted_at: null },
        });
        if (!admin) {
            return res.status(404).json({ error: "Administrador não encontrado." });
        }
        return res.status(200).json(admin);
    }
    catch (error) {
        console.error("Erro ao obter informações do administrador:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});
exports.getAdminById = getAdminById;
const listAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
        const skip = (page - 1) * itemsPerPage;
        const data = yield prisma.administrator.findMany({
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
        const total = yield prisma.administrator.count({
            where: { deleted_at: null },
        });
        const totalPages = Math.ceil(total / itemsPerPage);
        return res.status(200).json({ total, totalPages, currentPage: page, data });
    }
    catch (error) {
        console.error("Erro ao listar administradores:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.listAdmins = listAdmins;
const updateAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.params.id;
        const updates = req.body;
        const existingAdmin = yield prisma.administrator.findUnique({
            where: { id: adminId, deleted_at: null },
        });
        if (!existingAdmin) {
            return res.status(404).json({ error: "Administrador não encontrado." });
        }
        const data = {};
        if (updates.name) {
            data.name = updates.name;
        }
        if (updates.password) {
            const hashedPassword = yield bcrypt_1.default.hash(updates.password, 10);
            data.password = hashedPassword;
        }
        const updatedAdmin = yield prisma.administrator.update({
            where: { id: adminId },
            data,
        });
        return res.status(200).json(updatedAdmin);
    }
    catch (error) {
        console.error("Erro ao atualizar o administrador:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});
exports.updateAdmin = updateAdmin;
const deleteAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.params.id;
        const existingAdmin = yield prisma.administrator.findUnique({
            where: { id: adminId },
        });
        if (!existingAdmin) {
            return res.status(404).json({ error: "Administrador não encontrado." });
        }
        yield prisma.administrator.update({
            where: { id: adminId },
            data: {
                deleted_at: new Date(),
            },
        });
        return res.status(204).send();
    }
    catch (error) {
        console.error("Erro ao deletar o administrador:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});
exports.deleteAdmin = deleteAdmin;
