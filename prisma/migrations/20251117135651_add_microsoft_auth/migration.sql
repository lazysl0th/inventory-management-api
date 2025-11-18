-- CreateTable
CREATE TABLE "MicrosoftAuth" (
    "id" SERIAL NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "MicrosoftAuth_pkey" PRIMARY KEY ("id")
);
