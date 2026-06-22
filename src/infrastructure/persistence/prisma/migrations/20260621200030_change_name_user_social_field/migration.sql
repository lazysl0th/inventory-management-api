/*
  Warnings:

  - You are about to drop the column `facebookId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `googleId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[google]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[facebook]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_facebookId_key";

-- DropIndex
DROP INDEX "User_googleId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "facebookId",
DROP COLUMN "googleId",
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "google" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_google_key" ON "User"("google");

-- CreateIndex
CREATE UNIQUE INDEX "User_facebook_key" ON "User"("facebook");
