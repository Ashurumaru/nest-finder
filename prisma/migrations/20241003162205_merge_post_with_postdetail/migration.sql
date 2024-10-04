/*
  Warnings:

  - You are about to drop the `PostDetail` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PostDetail" DROP CONSTRAINT "PostDetail_postId_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "busStopDistance" INTEGER,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "incomeRequirement" TEXT,
ADD COLUMN     "petPolicy" TEXT,
ADD COLUMN     "propertySize" INTEGER,
ADD COLUMN     "restaurantDistance" INTEGER,
ADD COLUMN     "schoolDistance" INTEGER,
ADD COLUMN     "utilitiesIncluded" TEXT;

-- DropTable
DROP TABLE "PostDetail";
