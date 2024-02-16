-- AlterTable
ALTER TABLE "CardDetails" ADD COLUMN     "price_date" TIMESTAMP(3),
ADD COLUMN     "price_usd" DOUBLE PRECISION,
ADD COLUMN     "price_usd_foil" DOUBLE PRECISION;
