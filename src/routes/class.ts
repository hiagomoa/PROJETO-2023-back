import express from "express";
import {
  createClass,
  deleteClass,
  getClassById,
  listClasses,
  updateClass,
} from "../controllers/classController";

const router = express.Router();

router.post("/", createClass);
router.get("/:id", getClassById);
router.get("/", listClasses);
router.put("/:id", updateClass);
router.delete("/:id", deleteClass);

export default router;
