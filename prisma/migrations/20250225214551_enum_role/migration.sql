-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'WORKER', 'SUPERADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'WORKER';
