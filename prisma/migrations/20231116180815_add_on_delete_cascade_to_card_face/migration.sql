-- DropForeignKey
ALTER TABLE "CardFace" DROP CONSTRAINT "CardFace_cardId_fkey";

-- AddForeignKey
ALTER TABLE "CardFace" ADD CONSTRAINT "CardFace_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "CardDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;
