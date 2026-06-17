/*
  Warnings:

  - You are about to drop the column `itemId` on the `Comment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_itemId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "itemId";
