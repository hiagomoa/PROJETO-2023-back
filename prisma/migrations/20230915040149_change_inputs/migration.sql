/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Administrator` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Administrator` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `Professor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `Student` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Exercise_name_key";

-- AlterTable
ALTER TABLE "Administrator" ADD COLUMN     "email" VARCHAR(100) NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Exercise" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "html" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Professor" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "email" SET NOT NULL;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "email" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Administrator_email_key" ON "Administrator"("email");
