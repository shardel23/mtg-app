-- AlterTable
ALTER TABLE "Card" ALTER COLUMN "security_stamp" DROP NOT NULL,
ALTER COLUMN "security_stamp" SET DATA TYPE TEXT;
