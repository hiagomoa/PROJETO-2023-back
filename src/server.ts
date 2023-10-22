import 'dotenv/config'
import express from "express";
import {resolve} from 'path'
import bodyParser from "body-parser";
import administratorRoutes from "./routes/administrator";
import professorRoutes from "./routes/professor";
import studentRoutes from "./routes/student";
import classRoutes from "./routes/class";
import resultRoutes from "./routes/studentAnswer";
import exerciseRoutes from "./routes/exercise";
import loginRoutes from "./routes/login";
import upload from './routes/upload'
import cors from "cors";
export const emailTemplateFolder = resolve('public', 'templates');



const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json({limit : '50mb'}));
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
