"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const administrator_1 = __importDefault(require("./routes/administrator"));
const professor_1 = __importDefault(require("./routes/professor"));
const student_1 = __importDefault(require("./routes/student"));
const class_1 = __importDefault(require("./routes/class"));
const studentAnswer_1 = __importDefault(require("./routes/studentAnswer"));
const exercise_1 = __importDefault(require("./routes/exercise"));
const login_1 = __importDefault(require("./routes/login"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
// Use suas rotas
app.use("/admin", administrator_1.default);
app.use("/prof", professor_1.default);
app.use("/class", class_1.default);
app.use("/student", student_1.default);
app.use("/exercise", exercise_1.default);
app.use("/answer", studentAnswer_1.default);
app.use("/login", login_1.default);
app.listen(port, () => {
    console.log(`Servidor Express em execução na porta ${port}`);
});
