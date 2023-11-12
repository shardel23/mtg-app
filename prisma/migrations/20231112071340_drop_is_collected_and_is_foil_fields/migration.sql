/*
  Warnings:

  - You are about to drop the column `isCollected` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `isCollected` on the `CardDetails` table. All the data in the column will be lost.
  - You are about to drop the column `isFoil` on the `CardDetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Card" DROP COLUMN "isCollected";

-- AlterTable
ALTER TABLE "CardDetails" DROP COLUMN "isCollected",
DROP COLUMN "isFoil";
