import express from "express";
import {
  createAdmin,
  deleteAdmin,
  getAdminById,
  listAdmins,
  updateAdmin,
} from "../controllers/adminController";

const router = express.Router();

router.post("/", createAdmin);
router.get("/:id", getAdminById);
router.get("/", listAdmins);
router.put("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);

export default router;
