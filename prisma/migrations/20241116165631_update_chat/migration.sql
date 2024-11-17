/*
  Warnings:

  - You are about to drop the column `lastMessage` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `seenByUserIds` on the `Chat` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "RenovationState" ADD VALUE 'NO_RENOVATION';

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "lastMessage",
DROP COLUMN "seenByUserIds";
