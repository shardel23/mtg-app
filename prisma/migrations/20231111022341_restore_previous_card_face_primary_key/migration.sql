/*
  Warnings:

  - The primary key for the `CardFace` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "CardFace" DROP CONSTRAINT "CardFace_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "faceNumber" DROP NOT NULL,
ADD CONSTRAINT "CardFace_pkey" PRIMARY KEY ("id");
