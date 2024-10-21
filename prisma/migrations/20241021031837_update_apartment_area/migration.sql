/*
  Warnings:

  - You are about to drop the column `ApartmentArea` on the `apartments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "apartments" DROP COLUMN "ApartmentArea",
ADD COLUMN     "apartmentArea" DOUBLE PRECISION;
