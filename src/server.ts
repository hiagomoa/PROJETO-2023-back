import express from "express";
import bodyParser from "body-parser";
import administratorRoutes from "./routes/administrator";
import professorRoutes from "./routes/professor";
import studentRoutes from "./routes/student";
import classRoutes from "./routes/class";
import resultRoutes from "./routes/studentAnswer";
import exerciseRoutes from "./routes/exercise";
import loginRoutes from "./routes/login";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
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

app.listen(port, () => {
  console.log(`Servidor Express em execução na porta ${port}`);
});
