-- DropForeignKey
ALTER TABLE "public"."ItemValue" DROP CONSTRAINT "ItemValue_itemId_fkey";

-- AddForeignKey
ALTER TABLE "ItemValue" ADD CONSTRAINT "ItemValue_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemValue" ADD CONSTRAINT "ItemValue_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "InventoryField"("id") ON DELETE CASCADE ON UPDATE CASCADE;
