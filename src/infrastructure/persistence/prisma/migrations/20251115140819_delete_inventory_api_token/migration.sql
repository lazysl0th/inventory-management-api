/*
  Warnings:

  - You are about to drop the `InventoryApiToken` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[apiToken]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."InventoryApiToken" DROP CONSTRAINT "InventoryApiToken_inventoryId_fkey";

-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN     "apiToken" TEXT;

-- DropTable
DROP TABLE "public"."InventoryApiToken";

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_apiToken_key" ON "Inventory"("apiToken");
