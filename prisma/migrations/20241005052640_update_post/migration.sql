/*
  Warnings:

  - You are about to drop the column `incomeRequirement` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `restaurantDistance` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `utilitiesIncluded` on the `Post` table. All the data in the column will be lost.
  - You are about to alter the column `latitude` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `longitude` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - The `petPolicy` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "HeatingType" AS ENUM ('none', 'gas', 'electric', 'solar', 'other');

-- CreateEnum
CREATE TYPE "ParkingType" AS ENUM ('garage', 'street', 'assigned', 'covered', 'valet');

-- CreateEnum
CREATE TYPE "LeaseTerm" AS ENUM ('monthToMonth', 'sixMonths', 'oneYear', 'twoYears', 'other');

-- CreateEnum
CREATE TYPE "PetPolicy" AS ENUM ('notAllowed', 'allowed', 'allowedWithRestrictions');

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "incomeRequirement",
DROP COLUMN "restaurantDistance",
DROP COLUMN "utilitiesIncluded",
ADD COLUMN     "airConditioning" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "balcony" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "basement" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "floorNumber" INTEGER,
ADD COLUMN     "furnished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasElevator" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "heatingType" "HeatingType",
ADD COLUMN     "hoaFees" DECIMAL(65,30),
ADD COLUMN     "internetIncluded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "leaseTerm" "LeaseTerm",
ADD COLUMN     "lotSize" DOUBLE PRECISION,
ADD COLUMN     "moveInDate" TIMESTAMP(3),
ADD COLUMN     "parking" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parkingType" "ParkingType",
ADD COLUMN     "smokingAllowed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "totalFloors" INTEGER,
ADD COLUMN     "yearBuilt" INTEGER,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "latitude" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "longitude" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "busStopDistance" SET DATA TYPE DOUBLE PRECISION,
DROP COLUMN "petPolicy",
ADD COLUMN     "petPolicy" "PetPolicy",
ALTER COLUMN "propertySize" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "schoolDistance" SET DATA TYPE DOUBLE PRECISION;
