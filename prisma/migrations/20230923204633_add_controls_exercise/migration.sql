-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "maxAttempts" INTEGER;

-- AlterTable
ALTER TABLE "StudentAnswer" ADD COLUMN     "attempts" INTEGER DEFAULT 0,
ALTER COLUMN "answer" DROP NOT NULL;
