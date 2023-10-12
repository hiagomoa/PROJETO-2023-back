"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const exerciseController_1 = require("../controllers/exerciseController");
const router = express_1.default.Router();
router.post("/", exerciseController_1.createExercise);
router.get("/:id", exerciseController_1.getExerciseById);
router.get("/", exerciseController_1.listExercises);
router.put("/:id", exerciseController_1.updateExercise);
router.delete("/:id", exerciseController_1.deleteExercise);
exports.default = router;
