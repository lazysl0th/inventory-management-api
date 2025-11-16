/*
  Warnings:

  - A unique constraint covering the columns `[inventoryId]` on the table `InventoryApiToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "InventoryApiToken_inventoryId_key" ON "InventoryApiToken"("inventoryId");

-- AddForeignKey
ALTER TABLE "InventoryApiToken" ADD CONSTRAINT "InventoryApiToken_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
