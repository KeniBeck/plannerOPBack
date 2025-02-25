/*
  Warnings:

  - You are about to drop the column `jobAreaId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_jobAreaId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "jobAreaId",
ADD COLUMN     "id_area" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_id_area_fkey" FOREIGN KEY ("id_area") REFERENCES "JobArea"("id") ON DELETE SET NULL ON UPDATE CASCADE;
