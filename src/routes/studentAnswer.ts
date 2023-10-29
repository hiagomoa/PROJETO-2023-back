import express from "express";
import {
  createStudentAnswer,
  deleteStudentAnswer,
  getAnswerAutPut,
  getStudentAnswerById,
  listStudentAnswers,
  listStudentAnswersByExercise,
  updateStudentAnswer,
} from "../controllers/studentAnswerController";

const router = express.Router();

router.post("/", createStudentAnswer);
router.post("/out-put", getAnswerAutPut);
router.get("/:id", getStudentAnswerById);
router.get("/by-exercise/:id", listStudentAnswersByExercise);
router.get("/", listStudentAnswers);
router.put("/:id", updateStudentAnswer);
router.delete("/:id", deleteStudentAnswer);

export default router;
