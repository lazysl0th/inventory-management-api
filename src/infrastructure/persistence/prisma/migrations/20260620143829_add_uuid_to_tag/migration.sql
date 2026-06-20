/*
  Warnings:

  - The primary key for the `Tag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Tag` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `_InventoryTags` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `B` on the `_InventoryTags` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "_InventoryTags" DROP CONSTRAINT "_InventoryTags_B_fkey";

-- AlterTable
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "Tag_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "_InventoryTags" DROP CONSTRAINT "_InventoryTags_AB_pkey",
DROP COLUMN "B",
ADD COLUMN     "B" UUID NOT NULL,
ADD CONSTRAINT "_InventoryTags_AB_pkey" PRIMARY KEY ("A", "B");

-- CreateIndex
CREATE INDEX "_InventoryTags_B_index" ON "_InventoryTags"("B");

-- AddForeignKey
ALTER TABLE "_InventoryTags" ADD CONSTRAINT "_InventoryTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
