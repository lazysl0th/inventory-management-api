/*
  Warnings:

  - A unique constraint covering the columns `[salesForceId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "salesForceId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_salesForceId_key" ON "User"("salesForceId");
