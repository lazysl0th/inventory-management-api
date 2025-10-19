/*
  Warnings:

  - You are about to drop the column `custom_id_format` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Item` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[inventoryId,title]` on the table `InventoryField` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[inventoryId,customId]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customIdFormat` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `category` on the `Inventory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `ownerId` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Equipment', 'Furniture', 'Book', 'Other');

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_inventoryId_fkey";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "itemId" INTEGER,
ALTER COLUMN "inventoryId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "custom_id_format",
ADD COLUMN     "customIdFormat" JSONB NOT NULL,
ADD COLUMN     "itemsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "searchVector" tsvector,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1,
DROP COLUMN "category",
ADD COLUMN     "category" "Category" NOT NULL,
ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "createdBy",
ADD COLUMN     "ownerId" INTEGER NOT NULL,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Like" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_itemId_key" ON "Like"("userId", "itemId");

-- CreateIndex
CREATE INDEX "Inventory_searchVector_idx" ON "Inventory" USING GIN ("searchVector");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryField_inventoryId_title_key" ON "InventoryField"("inventoryId", "title");

-- CreateIndex
CREATE UNIQUE INDEX "Item_inventoryId_customId_key" ON "Item"("inventoryId", "customId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
