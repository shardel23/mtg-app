/*
  Warnings:

  - The primary key for the `CardFace` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `faceNumber` on table `CardFace` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CardFace" DROP CONSTRAINT "CardFace_pkey",
ALTER COLUMN "faceNumber" SET NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ADD CONSTRAINT "CardFace_pkey" PRIMARY KEY ("cardId", "faceNumber");
DROP SEQUENCE "CardFace_id_seq";
