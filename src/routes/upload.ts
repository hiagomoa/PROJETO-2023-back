import { PrismaClient } from "@prisma/client";
import express from "express";
import multer from "multer";
import multerConfig from "../config/upload";
import { S3StorageProvider } from "../shared/providers/r2/upload";
import { RedisService } from "../shared/providers/redis";
const router = express.Router();
const storageService = new S3StorageProvider();
const upload = multer({
  storage: multerConfig.storage,
});
const prisma = new PrismaClient();
const queueRedis = new RedisService();

router.post("/", upload.array("file"), async (req, res) => {
  const { files } = req;
  const allFiles = files as any[];
  if (allFiles?.length) {
    const nameList = await Promise.all(
      allFiles.map(async (file, index) => {
        const name = await storageService.save(file.filename);
        return name;
      })
    );
    const entity = req.query.entity;
    if (entity == "exerciseTeacher") {
      const inputFile = nameList.find((i) => i.includes("arq01"));
      const outputFile = nameList.find((i) => !i.includes("arq01"));
      const entityId = req.query.entityId;

      const content: any = {
        inputFile: `https://pub-b668eea891c54aa6910e596162b46f22.r2.dev/${inputFile}`,
        outputFile: `https://pub-b668eea891c54aa6910e596162b46f22.r2.dev/${outputFile}`,
        exerciseId: entityId,
      };
      await prisma.exerciseCorrection.create({ data: content });
    }

    if (entity == "studentAnswer") {
      try {
        const exerciseId = req.query.exerciseId as string;
        const studentId = req.query.studentId as string;

        const getExercise = await prisma.exercise.findUnique({
          where: {
            id: String(exerciseId),
          },
        });

        if (!getExercise) {
          return res.status(400).json({ error: "Exercise not found" });
        }

        const findOne = await prisma.studentAnswer.findFirst({
          where: {
            exerciseId: String(exerciseId),
            studentId: String(studentId),
          },
        });
        // send to queue
        const dataToSend = JSON.stringify({
          idExercicio: exerciseId,
          idProfessor: getExercise.professorId,
          idAluno: studentId,
        });

        await queueRedis.set("STUDENT_EXERCISE_CORRECTION", dataToSend);

        if (findOne) {
          if ((findOne.attempts || 0) > (getExercise.maxAttempts || 0)) {
            return res
              .status(400)
              .json({ error: "Quantidade maxima excedida" });
          }
          return await prisma.studentAnswer.update({
            where: { id: findOne.id },
            data: {
              answer: `https://pub-b668eea891c54aa6910e596162b46f22.r2.dev/upload?filename=${nameList[0]}`,
              attempts: (findOne?.attempts || 0) + 1,
            },
          });
        }
        const myData = {
          data: {
            studentId,
            exerciseId,
            answer: `https://pub-b668eea891c54aa6910e596162b46f22.r2.dev/upload?filename=${nameList[0]}`,
            attempts: 1,
          },
        };
        await prisma.studentAnswer.create({
          data: {
            studentId: studentId,
            exerciseId: exerciseId,
            answer: `https://pub-b668eea891c54aa6910e596162b46f22.r2.dev/upload?filename=${nameList[0]}`,
            attempts: 1,
            created_at: new Date(),
            updated_at: new Date(),
            deleted_at: null,
          },
        });
      } catch (error: any) {
        console.log(error.message);
      }
    }
  }
  return res.status(200).send("ok");
});

router.get("/", async (req, res) => {
  const filename = req.query.filename as string;

  if (!filename)
    return res.status(400).json({
      error: "Please add filename in query",
    });

  try {
    const file = await storageService.getFile(filename);
    if (!file) {
      return res.status(404).json({
        error: "File not found",
      });
    }
    return file.pipe(res);
  } catch (error) {
    return res.status(400).json({
      error,
    });
  }
});

export default router;
