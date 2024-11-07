/*
  Warnings:

  - You are about to alter the column `latitude` on the `posts` table. The data in that column could be lost. The data in that column will be cast from `Decimal(18,16)` to `Decimal(16,16)`.
  - You are about to alter the column `longitude` on the `posts` table. The data in that column could be lost. The data in that column will be cast from `Decimal(18,16)` to `Decimal(16,16)`.

*/
-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "latitude" SET DATA TYPE DECIMAL(16,16),
ALTER COLUMN "longitude" SET DATA TYPE DECIMAL(16,16);
