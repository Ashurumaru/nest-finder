/*
  Warnings:

  - You are about to drop the column `elevatorType` on the `apartments` table. All the data in the column will be lost.
  - You are about to drop the column `additionalBuildings` on the `houses` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "apartments" DROP COLUMN "elevatorType",
ADD COLUMN     "ApartmentArea" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "houses" DROP COLUMN "additionalBuildings";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "emailVerified";
