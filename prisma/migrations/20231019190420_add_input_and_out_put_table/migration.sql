-- CreateTable
CREATE TABLE "ExerciseCorrection" (
    "id" TEXT NOT NULL,
    "inputFile" TEXT,
    "outputFile" TEXT,
    "exerciseId" TEXT NOT NULL,

    CONSTRAINT "ExerciseCorrection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlunoItensInOut" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "testNumber" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "AlunoItensInOut_pkey" PRIMARY KEY ("id")
);
