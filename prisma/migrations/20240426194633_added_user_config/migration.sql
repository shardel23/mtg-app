-- CreateTable
CREATE TABLE "UserConfig" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "show17LandsSection" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserConfig_userId_key" ON "UserConfig"("userId");

-- AddForeignKey
ALTER TABLE "UserConfig" ADD CONSTRAINT "UserConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
