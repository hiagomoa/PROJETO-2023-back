"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profController_1 = require("../controllers/profController");
const router = express_1.default.Router();
router.post("/", profController_1.createProfessor);
router.get("/:id", profController_1.getProfessorById);
router.get("/", profController_1.listProfessors);
router.put("/:id", profController_1.updateProfessor);
router.delete("/:id", profController_1.deleteProfessor);
exports.default = router;
