-- AlterTable
ALTER TABLE "StudentAnswer" ADD COLUMN     "alunoItensInOutId" TEXT;

-- AddForeignKey
ALTER TABLE "StudentAnswer" ADD CONSTRAINT "StudentAnswer_alunoItensInOutId_fkey" FOREIGN KEY ("alunoItensInOutId") REFERENCES "AlunoItensInOut"("id") ON DELETE SET NULL ON UPDATE CASCADE;
