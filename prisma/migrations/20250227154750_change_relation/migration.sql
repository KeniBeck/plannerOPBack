/*
  Warnings:

  - Added the required column `id_user` to the `JobArea` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `Worker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobArea" ADD COLUMN     "id_user" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Worker" ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "JobArea" ADD CONSTRAINT "JobArea_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
