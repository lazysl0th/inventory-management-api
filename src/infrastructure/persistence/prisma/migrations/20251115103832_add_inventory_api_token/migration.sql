-- CreateTable
CREATE TABLE "InventoryApiToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryApiToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InventoryApiToken_token_key" ON "InventoryApiToken"("token");
