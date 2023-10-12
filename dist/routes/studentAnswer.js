"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentAnswerController_1 = require("../controllers/studentAnswerController");
const router = express_1.default.Router();
router.post("/", studentAnswerController_1.createStudentAnswer);
router.get("/:id", studentAnswerController_1.getStudentAnswerById);
router.get("/", studentAnswerController_1.listStudentAnswers);
router.put("/:id", studentAnswerController_1.updateStudentAnswer);
router.delete("/:id", studentAnswerController_1.deleteStudentAnswer);
exports.default = router;
