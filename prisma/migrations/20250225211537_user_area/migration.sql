/*
  Warnings:

  - You are about to drop the `_JobAreaToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `jobAreaId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_JobAreaToUser" DROP CONSTRAINT "_JobAreaToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_JobAreaToUser" DROP CONSTRAINT "_JobAreaToUser_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "jobAreaId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_JobAreaToUser";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_jobAreaId_fkey" FOREIGN KEY ("jobAreaId") REFERENCES "JobArea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
