/*
  Warnings:

  - You are about to alter the column `latitude` on the `posts` table. The data in that column could be lost. The data in that column will be cast from `Decimal(9,6)` to `Decimal(18,16)`.
  - You are about to alter the column `longitude` on the `posts` table. The data in that column could be lost. The data in that column will be cast from `Decimal(9,6)` to `Decimal(18,16)`.
  - Made the column `latitude` on table `posts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longitude` on table `posts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "latitude" SET NOT NULL,
ALTER COLUMN "latitude" SET DATA TYPE DECIMAL(18,16),
ALTER COLUMN "longitude" SET NOT NULL,
ALTER COLUMN "longitude" SET DATA TYPE DECIMAL(18,16);
