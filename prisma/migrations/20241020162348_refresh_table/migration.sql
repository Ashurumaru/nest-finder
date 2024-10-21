-- CreateEnum
CREATE TYPE "Type" AS ENUM ('SALE', 'RENT');

-- CreateEnum
CREATE TYPE "Property" AS ENUM ('APARTMENT', 'HOUSE', 'LAND_PLOT');

-- CreateEnum
CREATE TYPE "BuildingType" AS ENUM ('PANEL', 'BRICK', 'MONOLITH', 'WOOD', 'OTHER');

-- CreateEnum
CREATE TYPE "RenovationState" AS ENUM ('COSMETIC', 'EURO', 'DESIGNER');

-- CreateEnum
CREATE TYPE "HeatingType" AS ENUM ('NONE', 'GAS', 'ELECTRIC', 'SOLAR', 'OTHER');

-- CreateEnum
CREATE TYPE "ParkingType" AS ENUM ('GARAGE', 'STREET', 'ASSIGNED', 'COVERED');

-- CreateEnum
CREATE TYPE "PetPolicy" AS ENUM ('NOT_ALLOWED', 'ALLOWED', 'ALLOWED_WITH_RESTRICTIONS');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "RentalTerm" AS ENUM ('DAILY_PAYMENT', 'WEEKLY_PAYMENT', 'MONTHLY_PAYMENT');

-- CreateEnum
CREATE TYPE "UtilitiesPayment" AS ENUM ('INCLUDED', 'EXCLUDED', 'PARTIALLY_INCLUDED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT,
    "image" TEXT,
    "phoneNumber" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" DECIMAL(15,2) NOT NULL,
    "imageUrls" TEXT[],
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "type" "Type" NOT NULL,
    "property" "Property" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "views" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apartments" (
    "id" TEXT NOT NULL,
    "numBedrooms" INTEGER,
    "numBathrooms" INTEGER,
    "floorNumber" INTEGER,
    "totalFloors" INTEGER,
    "buildingType" "BuildingType",
    "yearBuilt" INTEGER,
    "ceilingHeight" DOUBLE PRECISION,
    "hasBalcony" BOOLEAN,
    "hasLoggia" BOOLEAN,
    "hasWalkInCloset" BOOLEAN,
    "balconyType" TEXT,
    "hasPassengerElevator" BOOLEAN,
    "hasFreightElevator" BOOLEAN,
    "elevatorType" TEXT,
    "heatingType" "HeatingType",
    "renovationState" "RenovationState",
    "parkingType" "ParkingType",
    "furnished" BOOLEAN,
    "internetSpeed" INTEGER,
    "flooring" TEXT,
    "soundproofing" BOOLEAN,
    "postId" TEXT NOT NULL,

    CONSTRAINT "apartments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "houses" (
    "id" TEXT NOT NULL,
    "numberOfFloors" INTEGER,
    "numberOfRooms" INTEGER,
    "houseArea" DOUBLE PRECISION,
    "landArea" DOUBLE PRECISION,
    "wallMaterial" TEXT,
    "yearBuilt" INTEGER,
    "hasGarage" BOOLEAN,
    "garageArea" DOUBLE PRECISION,
    "hasBasement" BOOLEAN,
    "basementArea" DOUBLE PRECISION,
    "additionalBuildings" JSONB,
    "heatingType" "HeatingType",
    "houseCondition" "RenovationState",
    "fencing" BOOLEAN,
    "furnished" BOOLEAN,
    "internetSpeed" INTEGER,
    "flooring" TEXT,
    "soundproofing" BOOLEAN,
    "postId" TEXT NOT NULL,

    CONSTRAINT "houses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "land_plots" (
    "id" TEXT NOT NULL,
    "landArea" DOUBLE PRECISION,
    "landPurpose" TEXT,
    "waterSource" TEXT,
    "fencing" BOOLEAN,
    "postId" TEXT NOT NULL,

    CONSTRAINT "land_plots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rental_features" (
    "id" TEXT NOT NULL,
    "rentalTerm" "RentalTerm",
    "securityDeposit" DECIMAL(10,2),
    "securityDepositConditions" TEXT,
    "utilitiesPayment" "UtilitiesPayment",
    "utilitiesCost" DECIMAL(10,2),
    "leaseAgreementUrl" TEXT,
    "petPolicy" "PetPolicy",
    "availabilityDate" TIMESTAMP(3),
    "minimumLeaseTerm" INTEGER,
    "maximumLeaseTerm" INTEGER,
    "postId" TEXT NOT NULL,

    CONSTRAINT "rental_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sale_features" (
    "id" TEXT NOT NULL,
    "mortgageAvailable" BOOLEAN,
    "priceNegotiable" BOOLEAN,
    "availabilityDate" TIMESTAMP(3),
    "titleDeedUrl" TEXT,
    "postId" TEXT NOT NULL,

    CONSTRAINT "sale_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedPost" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "seenByUserIds" TEXT[],
    "lastMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatUser" (
    "chatId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ChatUser_pkey" PRIMARY KEY ("chatId","userId")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "messageText" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "token_type" TEXT,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "scope" TEXT,
    "id_token" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "session_token" TEXT NOT NULL,
    "access_token" TEXT,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationRequest" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "apartments_postId_key" ON "apartments"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "houses_postId_key" ON "houses"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "land_plots_postId_key" ON "land_plots"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "rental_features_postId_key" ON "rental_features"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "sale_features_postId_key" ON "sale_features"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedPost_userId_postId_key" ON "SavedPost"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationRequest_token_key" ON "VerificationRequest"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationRequest_identifier_token_key" ON "VerificationRequest"("identifier", "token");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apartments" ADD CONSTRAINT "apartments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "houses" ADD CONSTRAINT "houses_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "land_plots" ADD CONSTRAINT "land_plots_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rental_features" ADD CONSTRAINT "rental_features_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sale_features" ADD CONSTRAINT "sale_features_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedPost" ADD CONSTRAINT "SavedPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedPost" ADD CONSTRAINT "SavedPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatUser" ADD CONSTRAINT "ChatUser_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatUser" ADD CONSTRAINT "ChatUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
