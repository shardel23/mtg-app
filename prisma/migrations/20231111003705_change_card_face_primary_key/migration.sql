/*
  Warnings:

  - The primary key for the `CardFace` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `CardFace` table. All the data in the column will be lost.
  - Added the required column `faceNumber` to the `CardFace` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CardFace" DROP CONSTRAINT "CardFace_pkey",
DROP COLUMN "id",
ADD COLUMN     "faceNumber" INTEGER NOT NULL,
ADD CONSTRAINT "CardFace_pkey" PRIMARY KEY ("cardId", "faceNumber");
