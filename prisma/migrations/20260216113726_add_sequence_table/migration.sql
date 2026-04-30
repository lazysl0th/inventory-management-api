/*
  Warnings:

  - You are about to drop the column `apiToken` on the `Inventory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Inventory_apiToken_key";

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "apiToken",
ADD COLUMN     "token" TEXT,
ALTER COLUMN "customIdFormat" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Sequence" (
    "partGuid" TEXT NOT NULL,
    "currentValue" INTEGER NOT NULL,

    CONSTRAINT "Sequence_pkey" PRIMARY KEY ("partGuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_token_key" ON "Inventory"("token");
