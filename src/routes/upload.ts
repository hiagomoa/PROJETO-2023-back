import express from "express";
import multer from "multer";
const router = express.Router();
import multerConfig from "../config/upload";
import { S3StorageProvider } from "../shared/providers/r2/upload";
import { PrismaClient } from "@prisma/client";
const storageService = new S3StorageProvider();
const upload = multer({
  storage: multerConfig.storage,
});
const prisma = new PrismaClient();

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
        inputFile: `${process.env.HOST_URL}/upload?filename=${inputFile}`,
        outputFile: `${process.env.HOST_URL}/upload?filename=${outputFile}`,
        exerciseId: entityId,
      };
      await prisma.exerciseCorrection.create({ data: content });
    }

    if (entity == "studentAnswer") {
      try {
        const exerciseId = req.query.exerciseId as string;
        const studentId = req.query.studentId as string;
        const findOne = await prisma.studentAnswer.findFirst({
          where: {
            exerciseId: String(exerciseId),
            studentId: String(studentId),
          },
        });

        if (findOne) {
          return await prisma.studentAnswer.update({
            where: { id: findOne.id },
            data: {
              answer: `${process.env.HOST_URL}/upload?filename=${nameList[0]}`,
              attempts: (findOne?.attempts || 0) + 1,
            },
          });
        }
        const myData = {
          data: {
            studentId,
            exerciseId,
            answer: `${process.env.HOST_URL}/upload?filename=${nameList[0]}`,
            attempts: 1,
          },
        };

        await prisma.studentAnswer.create(myData);
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
