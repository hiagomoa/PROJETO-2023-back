import express from "express";
import {
  createExercise,
  deleteExercise,
  getExerciseById,
  listExercises,
  updateExercise,
} from "../controllers/exerciseController";

const router = express.Router();

router.post("/", createExercise);
router.get("/:id", getExerciseById);
router.get("/", listExercises);
router.put("/:id", updateExercise);
router.delete("/:id", deleteExercise);

export default router;
