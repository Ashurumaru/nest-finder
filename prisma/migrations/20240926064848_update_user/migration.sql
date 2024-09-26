/*
  Warnings:

  - The values [buy] on the enum `Type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `email_verified` on the `users` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Property" ADD VALUE 'townhouse';
ALTER TYPE "Property" ADD VALUE 'commercial';

-- AlterEnum
BEGIN;
CREATE TYPE "Type_new" AS ENUM ('sale', 'rent');
ALTER TABLE "Post" ALTER COLUMN "type" TYPE "Type_new" USING ("type"::text::"Type_new");
ALTER TYPE "Type" RENAME TO "Type_old";
ALTER TYPE "Type_new" RENAME TO "Type";
DROP TYPE "Type_old";
COMMIT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "email_verified";
