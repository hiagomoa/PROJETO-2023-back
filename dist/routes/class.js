"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const classController_1 = require("../controllers/classController");
const router = express_1.default.Router();
router.post("/", classController_1.createClass);
router.get("/:id", classController_1.getClassById);
router.get("/", classController_1.listClasses);
router.put("/:id", classController_1.updateClass);
router.delete("/:id", classController_1.deleteClass);
exports.default = router;
