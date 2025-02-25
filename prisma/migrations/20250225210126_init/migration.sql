-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "dni" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobArea" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "JobArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_JobAreaToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_JobAreaToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_dni_key" ON "User"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "_JobAreaToUser_B_index" ON "_JobAreaToUser"("B");

-- AddForeignKey
ALTER TABLE "_JobAreaToUser" ADD CONSTRAINT "_JobAreaToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "JobArea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JobAreaToUser" ADD CONSTRAINT "_JobAreaToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
