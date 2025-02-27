/*
  Warnings:

  - The values [WORKER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `id_area` on the `User` table. All the data in the column will be lost.
  - Added the required column `occupation` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('AVALIABLE', 'ASSIGNED', 'UNAVALIABLE', 'DEACTIVATED');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'SUPERADMIN');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'ADMIN';
COMMIT;

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_id_area_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "id_area",
ADD COLUMN     "occupation" TEXT NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'ADMIN';

-- CreateTable
CREATE TABLE "Worker" (
    "id" SERIAL NOT NULL,
    "dni" TEXT NOT NULL,
    "phone" TEXT,
    "name" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'AVALIABLE',
    "id_area" INTEGER,

    CONSTRAINT "Worker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Worker_dni_key" ON "Worker"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_phone_key" ON "Worker"("phone");

-- AddForeignKey
ALTER TABLE "Worker" ADD CONSTRAINT "Worker_id_area_fkey" FOREIGN KEY ("id_area") REFERENCES "JobArea"("id") ON DELETE SET NULL ON UPDATE CASCADE;
