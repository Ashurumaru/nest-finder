/*
  Warnings:

  - You are about to drop the column `birthday` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "birthday",
ADD COLUMN     "phoneNumber" TEXT;
