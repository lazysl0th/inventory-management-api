-- DropForeignKey
ALTER TABLE "public"."InventoryField" DROP CONSTRAINT "InventoryField_inventoryId_fkey";

-- AddForeignKey
ALTER TABLE "InventoryField" ADD CONSTRAINT "InventoryField_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
