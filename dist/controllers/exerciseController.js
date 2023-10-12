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
exports.deleteExercise = exports.updateExercise = exports.listExercises = exports.getExerciseById = exports.createExercise = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createExercise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, dueDate, html, professorId, classId, maxAttempts, } = req.body;
        const createdExercise = yield prisma.exercise.create({
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
    }
    catch (error) {
        console.error("Erro ao criar o exercício:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});
exports.createExercise = createExercise;
const getExerciseById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exerciseId = req.params.id;
        const exercise = yield prisma.exercise.findUnique({
            where: { id: exerciseId, deleted_at: null },
        });
        if (!exercise) {
            return res.status(404).json({ error: "Exercício não encontrado." });
        }
        return res.status(200).json(exercise);
    }
    catch (error) {
        console.error("Erro ao buscar o exercício pelo ID:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});
exports.getExerciseById = getExerciseById;
const listExercises = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.query.id;
        const userRole = req.query.role;
        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
        const skip = (page - 1) * itemsPerPage;
        const classId = req.query.classId;
        let filter = {
            deleted_at: null,
        };
        if (userRole === "PROFESSOR") {
            filter = Object.assign(Object.assign({}, filter), { professorId: String(userId) });
        }
        else if (userRole === "STUDENT") {
            const student = yield prisma.student.findUnique({
                where: {
                    id: String(userId),
                },
            });
            filter = Object.assign(Object.assign({}, filter), { classId: String(student === null || student === void 0 ? void 0 : student.classId) });
        }
        if (classId) {
            filter.classId = classId;
        }
        const data = yield prisma.exercise.findMany({
            where: filter,
            orderBy: {
                updated_at: "desc",
            },
            skip,
            take: itemsPerPage,
        });
        const total = yield prisma.exercise.count({
            where: filter,
        });
        const totalPages = Math.ceil(total / itemsPerPage);
        return res.status(200).json({ total, totalPages, currentPage: page, data });
    }
    catch (error) {
        console.error("Erro ao listar os exercícios:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});
exports.listExercises = listExercises;
const updateExercise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exerciseId = req.params.id;
        const { name, description, dueDate, html, professorId, classId } = req.body;
        const updatedExercise = yield prisma.exercise.update({
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
    }
    catch (error) {
        console.error("Erro ao atualizar o exercício:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});
exports.updateExercise = updateExercise;
const deleteExercise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exerciseId = req.params.id;
        yield prisma.exercise.update({
            where: { id: exerciseId },
            data: {
                deleted_at: new Date(),
            },
        });
        return res.status(204).send();
    }
    catch (error) {
        console.error("Erro ao excluir o exercício:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});
exports.deleteExercise = deleteExercise;
