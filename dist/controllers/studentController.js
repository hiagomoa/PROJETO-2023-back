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
exports.deleteStudent = exports.listStudents = exports.getStudentById = exports.updateStudent = exports.createStudent = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const createStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, professorId, classId, ra } = req.body;
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const existingAdmin = yield prisma.administrator.findFirst({
            where: {
                email: email,
            },
        });
        const existingProfessor = yield prisma.professor.findFirst({
            where: {
                email: email,
            },
        });
        if (existingAdmin || existingProfessor) {
            return res.status(400).json({
                error: "Este e-mail já está em uso por um administrador ou professor.",
            });
        }
        const createdStudent = yield prisma.student.create({
            data: {
                name,
                email,
                password: hashedPassword,
                ra,
                professorId,
                classId,
            },
        });
        return res.status(201).json(createdStudent);
    }
    catch (error) {
        console.error("Erro ao criar o estudante:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});
exports.createStudent = createStudent;
const updateStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentId = req.params.id;
        const { name, email, password, professorId, classId, ra } = req.body;
        // Verifique se o estudante existe
        const existingStudent = yield prisma.student.findUnique({
            where: { id: studentId, deleted_at: null },
        });
        if (!existingStudent) {
            return res.status(404).json({ error: "Estudante não encontrado." });
        }
        // Crie um objeto com os campos que serão atualizados
        const updateData = {};
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
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            updateData.password = hashedPassword;
        }
        if (professorId) {
            updateData.professorId = professorId;
        }
        if (classId) {
            updateData.classId = classId;
        }
        // Atualize os campos do estudante
        const updatedStudent = yield prisma.student.update({
            where: { id: studentId, deleted_at: null },
            data: updateData,
        });
        return res.status(200).json(updatedStudent);
    }
    catch (error) {
        console.error("Erro ao atualizar o estudante:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});
exports.updateStudent = updateStudent;
const getStudentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentId = req.params.id;
        const student = yield prisma.student.findUnique({
            where: { id: studentId, deleted_at: null },
        });
        if (!student) {
            return res.status(404).json({ error: "Estudante não encontrado." });
        }
        return res.status(200).json(student);
    }
    catch (error) {
        console.error("Erro ao buscar o estudante:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});
exports.getStudentById = getStudentById;
const listStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.query.id;
        const userRole = req.query.role;
        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
        const skip = (page - 1) * itemsPerPage;
        let filter = {
            deleted_at: null,
        };
        if (userRole === "PROFESSOR") {
            filter = Object.assign(Object.assign({}, filter), { professorId: String(userId) });
        }
        const data = yield prisma.student.findMany({
            where: filter,
            orderBy: {
                updated_at: "desc",
            },
            skip,
            take: itemsPerPage,
        });
        const total = yield prisma.student.count({
            where: { deleted_at: null },
        });
        const totalPages = Math.ceil(total / itemsPerPage);
        return res.status(200).json({ total, totalPages, currentPage: page, data });
    }
    catch (error) {
        console.error("Erro ao listar estudantes:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});
exports.listStudents = listStudents;
const deleteStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentId = req.params.id;
        yield prisma.student.update({
            where: { id: studentId },
            data: {
                deleted_at: new Date(),
            },
        });
        return res.status(204).send();
    }
    catch (error) {
        console.error("Erro ao excluir o estudante:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});
exports.deleteStudent = deleteStudent;
