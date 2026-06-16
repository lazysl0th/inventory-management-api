-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Active', 'Blocked');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'Active';
