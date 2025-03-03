/*
  Warnings:

  - Made the column `timeEnd` on table `Operation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Operation" ALTER COLUMN "timeStrat" SET DATA TYPE TEXT,
ALTER COLUMN "timeEnd" SET NOT NULL,
ALTER COLUMN "timeEnd" SET DATA TYPE TEXT;
