/*
  Warnings:

  - You are about to drop the `_InventoryTags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_InventoryTags" DROP CONSTRAINT "_InventoryTags_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_InventoryTags" DROP CONSTRAINT "_InventoryTags_B_fkey";

-- DropTable
DROP TABLE "public"."_InventoryTags";

-- CreateTable
CREATE TABLE "InventoryTag" (
    "inventoryId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "InventoryTag_pkey" PRIMARY KEY ("inventoryId","tagId")
);

-- AddForeignKey
ALTER TABLE "InventoryTag" ADD CONSTRAINT "InventoryTag_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTag" ADD CONSTRAINT "InventoryTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
