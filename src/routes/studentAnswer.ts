import express from "express";
import {
  createStudentAnswer,
  deleteStudentAnswer,
  getStudentAnswerById,
  listStudentAnswers,
  updateStudentAnswer,
} from "../controllers/studentAnswerController";

const router = express.Router();

router.post("/", createStudentAnswer);
router.get("/:id", getStudentAnswerById);
router.get("/", listStudentAnswers);
router.put("/:id", updateStudentAnswer);
router.delete("/:id", deleteStudentAnswer);

export default router;
