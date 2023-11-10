/*
  Warnings:

  - You are about to drop the `Card` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_albumId_fkey";

-- DropForeignKey
ALTER TABLE "CardFace" DROP CONSTRAINT "CardFace_cardId_cardAlbumId_fkey";

-- AlterTableName
ALTER TABLE "Card" RENAME TO "CardDetails";

-- AddForeignKey
ALTER TABLE "CardDetails" ADD CONSTRAINT "CardDetails_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardFace" ADD CONSTRAINT "CardFace_cardId_cardAlbumId_fkey" FOREIGN KEY ("cardId", "cardAlbumId") REFERENCES "CardDetails"("id", "albumId") ON DELETE SET NULL ON UPDATE CASCADE;
