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
exports.deleteStudentAnswer = exports.updateStudentAnswer = exports.listStudentAnswers = exports.getStudentAnswerById = exports.createStudentAnswer = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createStudentAnswer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId, exerciseId, answer, attempts } = req.body;
        const createdStudentAnswer = yield prisma.studentAnswer.create({
            data: {
                studentId,
                exerciseId,
                answer,
                attempts
            },
        });
        return res.status(201).json(createdStudentAnswer);
    }
    catch (error) {
        console.error("Erro ao criar a resposta do estudante:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});
exports.createStudentAnswer = createStudentAnswer;
const getStudentAnswerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentAnswerId = req.params.id;
        const studentAnswer = yield prisma.studentAnswer.findUnique({
            where: { id: studentAnswerId },
        });
        if (!studentAnswer) {
            return res
                .status(404)
                .json({ error: "Resposta do estudante não encontrada." });
        }
        return res.status(200).json(studentAnswer);
    }
    catch (error) {
        console.error("Erro ao buscar a resposta do estudante:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});
exports.getStudentAnswerById = getStudentAnswerById;
const listStudentAnswers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentAnswers = yield prisma.studentAnswer.findMany();
        return res.status(200).json(studentAnswers);
    }
    catch (error) {
        console.error("Erro ao listar as respostas dos estudantes:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});
exports.listStudentAnswers = listStudentAnswers;
const updateStudentAnswer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentAnswerId = req.params.id;
        const { studentId, exerciseId, answer } = req.body;
        const updatedStudentAnswer = yield prisma.studentAnswer.update({
            where: { id: studentAnswerId },
            data: {
                studentId,
                exerciseId,
                answer,
            },
        });
        return res.status(200).json(updatedStudentAnswer);
    }
    catch (error) {
        console.error("Erro ao atualizar a resposta do estudante:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});
exports.updateStudentAnswer = updateStudentAnswer;
const deleteStudentAnswer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentAnswerId = req.params.id;
        yield prisma.studentAnswer.update({
            where: { id: studentAnswerId },
            data: {
                deleted_at: new Date(),
            },
        });
        return res.status(204).send();
    }
    catch (error) {
        console.error("Erro ao excluir a resposta do estudante:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});
exports.deleteStudentAnswer = deleteStudentAnswer;
