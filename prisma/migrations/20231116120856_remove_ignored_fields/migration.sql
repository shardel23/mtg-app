/*
  Warnings:

  - You are about to drop the column `albumId` on the `CardDetails` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `CardFace` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CardDetails" DROP COLUMN "albumId";

-- AlterTable
ALTER TABLE "CardFace" DROP COLUMN "id";
