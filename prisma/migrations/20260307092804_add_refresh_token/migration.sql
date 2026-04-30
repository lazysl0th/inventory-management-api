/*
  Warnings:

  - You are about to drop the column `reset_token` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "reset_token",
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "resetPasswordToken" TEXT;
