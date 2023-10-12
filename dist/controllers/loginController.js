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
exports.login = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_1 = require("../utils/auth");
const prisma = new client_1.PrismaClient();
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const admin = yield prisma.administrator.findFirst({
            where: {
                email: email,
            },
        });
        const professor = yield prisma.professor.findFirst({
            where: {
                email: email,
            },
        });
        const student = yield prisma.student.findFirst({
            where: {
                email: email,
            },
        });
        if (admin && (yield bcrypt_1.default.compare(password, admin.password))) {
            const token = (0, auth_1.generateToken)({
                userId: admin.id,
                userType: admin.role,
            });
            return res.status(200).json({ user: admin, token });
        }
        else if (professor &&
            (yield bcrypt_1.default.compare(password, professor.password))) {
            const token = (0, auth_1.generateToken)({
                userId: professor.id,
                userType: professor.role,
            });
            return res.status(200).json({ user: professor, token });
        }
        else if (student && (yield bcrypt_1.default.compare(password, student.password))) {
            const token = (0, auth_1.generateToken)({
                userId: student.id,
                userType: student.role,
            });
            return res.status(200).json({ user: student, token });
        }
        else {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }
    }
    catch (error) {
        console.error("Erro ao fazer login:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
    }
});
exports.login = login;
