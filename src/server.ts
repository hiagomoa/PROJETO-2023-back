import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { resolve } from "path";
import administratorRoutes from "./routes/administrator";
import classRoutes from "./routes/class";
import exerciseRoutes from "./routes/exercise";
import loginRoutes from "./routes/login";
import professorRoutes from "./routes/professor";
import studentRoutes from "./routes/student";
import resultRoutes from "./routes/studentAnswer";
import upload from "./routes/upload";
export const emailTemplateFolder = resolve("public", "templates");

const app = express();
const port = process.env.PORT || 3001;
console.log("url", process.env.REDIS_URL);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Use suas rotas
app.use("/admin", administratorRoutes);
app.use("/prof", professorRoutes);
app.use("/class", classRoutes);
app.use("/student", studentRoutes);
app.use("/exercise", exerciseRoutes);
app.use("/answer", resultRoutes);
app.use("/login", loginRoutes);
app.use("/upload", upload);

app.listen(port, () => {
  console.log(`Servidor Express em execução na porta ${port}`);
});
