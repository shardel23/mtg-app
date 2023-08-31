/*
  Warnings:

  - Added the required column `rarity` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `setCode` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `setIconSvgUri` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "rarity" TEXT NOT NULL,
ADD COLUMN     "setCode" TEXT NOT NULL,
ADD COLUMN     "setIconSvgUri" TEXT NOT NULL;
