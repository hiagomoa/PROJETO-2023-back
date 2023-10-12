import express from "express";
import {
  createProfessor,
  deleteProfessor,
  getProfessorById,
  listProfessors,
  updateProfessor,
} from "../controllers/profController";

const router = express.Router();

router.post("/", createProfessor);
router.get("/:id", getProfessorById);
router.get("/", listProfessors);
router.put("/:id", updateProfessor);
router.delete("/:id", deleteProfessor);

export default router;
