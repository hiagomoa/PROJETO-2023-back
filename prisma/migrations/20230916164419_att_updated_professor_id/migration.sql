/*
  Warnings:

  - Made the column `administratorId` on table `Professor` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Professor" DROP CONSTRAINT "Professor_administratorId_fkey";

-- DropIndex
DROP INDEX "Administrator_name_key";

-- DropIndex
DROP INDEX "Class_name_key";

-- DropIndex
DROP INDEX "Professor_name_key";

-- DropIndex
DROP INDEX "Student_name_key";

-- AlterTable
ALTER TABLE "Professor" ALTER COLUMN "administratorId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Professor" ADD CONSTRAINT "Professor_administratorId_fkey" FOREIGN KEY ("administratorId") REFERENCES "Administrator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
