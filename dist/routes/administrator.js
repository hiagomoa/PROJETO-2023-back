"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const router = express_1.default.Router();
router.post("/", adminController_1.createAdmin);
router.get("/:id", adminController_1.getAdminById);
router.get("/", adminController_1.listAdmins);
router.put("/:id", adminController_1.updateAdmin);
router.delete("/:id", adminController_1.deleteAdmin);
exports.default = router;
