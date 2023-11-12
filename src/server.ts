import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { resolve } from "path";
import { AdminRoutes } from "./routes/administrator";
import { AuthRoutes } from "./routes/auth";
import { ClassRoutes } from "./routes/class";
import { ExercisesRoutes } from "./routes/exercise";
import { InOutsRoutes } from "./routes/inOuts";
import { TeacherRoutes } from "./routes/professor";
import { StudentRoutes } from "./routes/student";
import { StudentAnswerRoutes } from "./routes/studentAnswer";
import upload from "./routes/upload";
export const emailTemplateFolder = resolve("public", "templates");

const app = express();
// app.use(express.json());
const port = process.env.PORT || 3050;
const dburl = process.env.DATABASE_URL;
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
app.use("/upload", upload);
app.use("/auth", AuthRoutes);
app.use("/inOuts", InOutsRoutes);

app.listen(port, () => {
  console.log(`Servidor Express em execução na porta ${port}`);
});
