import express from "express";
import {
  createStudent,
  deleteStudent,
  getStudentById,
  listStudents,
  updateStudent,
} from "../controllers/studentController";

const router = express.Router();

router.post("/", createStudent);
router.get("/:id", getStudentById);
router.get("/", listStudents);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;
