/*
  Warnings:

  - A unique constraint covering the columns `[itemId,fieldId]` on the table `ItemValue` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ItemValue_itemId_fieldId_key" ON "ItemValue"("itemId", "fieldId");
