import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { resolve } from "path";
import { AdminRoutes } from "./routes/administrator";
import { AuthRoutes } from "./routes/auth";
import { ClassRoutes } from "./routes/class";
import { ExercisesRoutes } from "./routes/exercise";
import loginRoutes from "./routes/login";
import { TeacherRoutes } from "./routes/professor";
import { StudentRoutes } from "./routes/student";
import { StudentAnswerRoutes } from "./routes/studentAnswer";
import upload from "./routes/upload";
export const emailTemplateFolder = resolve("public", "templates");

const app = express();
// app.use(express.json());
const port = process.env.PORT || 3001;
const dburl = process.env.DATABASE_URL;
console.log(dburl);
console.log("url", process.env.REDIS_URL);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

// Use suas rotas
app.use("/admin", AdminRoutes);
app.use("/prof", TeacherRoutes);
app.use("/class", ClassRoutes);
app.use("/student", StudentRoutes);
app.use("/exercise", ExercisesRoutes);
app.use("/answer", StudentAnswerRoutes);
app.use("/login", loginRoutes);
app.use("/upload", upload);
app.use("/auth", AuthRoutes);

app.listen(port, () => {
  console.log(`Servidor Express em execução na porta ${port}`);
});
