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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteClass = exports.updateClass = exports.listClasses = exports.getClassById = exports.createClass = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createClass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, professorId } = req.body;
        const createdClass = yield prisma.class.create({
            data: {
                name,
                professorId,
            },
        });
        return res.status(201).json(createdClass);
    }
    catch (error) {
        console.error("Erro ao criar a classe:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});
exports.createClass = createClass;
const getClassById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classId = req.params.id;
        const classItem = yield prisma.class.findUnique({
            where: { id: classId, deleted_at: null },
        });
        if (!classItem) {
            return res.status(404).json({ error: "Classe não encontrada." });
        }
        return res.status(200).json(classItem);
    }
    catch (error) {
        console.error("Erro ao buscar a classe pelo ID:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});
exports.getClassById = getClassById;
const listClasses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        if (userRole === "STUDENT") {
            const student = yield prisma.student.findUnique({
                where: {
                    id: String(userId),
                },
            });
            filter = Object.assign(Object.assign({}, filter), { id: String(student === null || student === void 0 ? void 0 : student.classId) });
        }
        const data = yield prisma.class.findMany({
            where: filter,
            orderBy: {
                updated_at: "desc",
            },
            skip,
            take: itemsPerPage,
        });
        const total = yield prisma.class.count({
            where: { deleted_at: null },
        });
        const totalPages = Math.ceil(total / itemsPerPage);
        return res.status(200).json({ total, totalPages, currentPage: page, data });
    }
    catch (error) {
        console.error("Erro ao listar as classes:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});
exports.listClasses = listClasses;
const updateClass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classId = req.params.id;
        const { name, professorId } = req.body;
        const updatedClass = yield prisma.class.update({
            where: { id: classId, deleted_at: null },
            data: {
                name,
                professorId,
            },
        });
        return res.status(200).json(updatedClass);
    }
    catch (error) {
        console.error("Erro ao atualizar a classe:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});
exports.updateClass = updateClass;
const deleteClass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classId = req.params.id;
        yield prisma.class.update({
            where: { id: classId },
            data: {
                deleted_at: new Date(),
            },
        });
        return res.status(204).send();
    }
    catch (error) {
        console.error("Erro ao excluir a classe:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});
exports.deleteClass = deleteClass;
