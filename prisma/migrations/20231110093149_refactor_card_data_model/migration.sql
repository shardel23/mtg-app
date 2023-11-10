/*
  Warnings:

  - The primary key for the `CardDetails` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cardAlbumId` on the `CardFace` table. All the data in the column will be lost.
  - Made the column `cardId` on table `CardFace` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CardDetails" DROP CONSTRAINT "CardDetails_albumId_fkey";

-- DropForeignKey
ALTER TABLE "CardFace" DROP CONSTRAINT "CardFace_cardId_cardAlbumId_fkey";

-- AlterTable
ALTER TABLE "CardDetails" DROP CONSTRAINT "CardDetails_pkey",
ADD CONSTRAINT "CardDetails_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CardFace" DROP COLUMN "cardAlbumId",
ALTER COLUMN "cardId" SET NOT NULL;

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "isCollected" BOOLEAN NOT NULL DEFAULT false,
    "isFoil" BOOLEAN NOT NULL DEFAULT false,
    "albumId" INTEGER NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id","albumId")
);

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_id_fkey" FOREIGN KEY ("id") REFERENCES "CardDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardFace" ADD CONSTRAINT "CardFace_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "CardDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
