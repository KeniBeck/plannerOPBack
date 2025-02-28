-- CreateEnum
CREATE TYPE "StatusOperation" AS ENUM ('PENDING', 'INPROGRESS', 'COMPLETED', 'CANCELED');

-- CreateTable
CREATE TABLE "Operation" (
    "id" SERIAL NOT NULL,
    "status" "StatusOperation" NOT NULL DEFAULT 'PENDING',
    "dateStart" TIMESTAMP(3) NOT NULL,
    "dateEnd" TIMESTAMP(3) NOT NULL,
    "timeStrat" TIMESTAMP(3) NOT NULL,
    "timeEnd" TIMESTAMP(3) NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_area" INTEGER NOT NULL,
    "id_task" INTEGER NOT NULL,

    CONSTRAINT "Operation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Operation_Worker" (
    "id" SERIAL NOT NULL,
    "id_operation" INTEGER NOT NULL,
    "id_worker" INTEGER NOT NULL,

    CONSTRAINT "Operation_Worker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_id_area_fkey" FOREIGN KEY ("id_area") REFERENCES "JobArea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_id_task_fkey" FOREIGN KEY ("id_task") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operation_Worker" ADD CONSTRAINT "Operation_Worker_id_operation_fkey" FOREIGN KEY ("id_operation") REFERENCES "Operation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operation_Worker" ADD CONSTRAINT "Operation_Worker_id_worker_fkey" FOREIGN KEY ("id_worker") REFERENCES "Worker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
