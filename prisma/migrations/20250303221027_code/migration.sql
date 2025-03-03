/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Worker` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Worker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'DISABLE';

-- AlterTable
ALTER TABLE "Operation" ALTER COLUMN "timeEnd" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Worker" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "dateDisableEnd" TIMESTAMP(3),
ADD COLUMN     "dateDisableStart" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Worker_code_key" ON "Worker"("code");
