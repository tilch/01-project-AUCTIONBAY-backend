/*
  Warnings:

  - The primary key for the `Auction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `currentBid` on the `Auction` table. All the data in the column will be lost.
  - You are about to drop the column `currentWinnerId` on the `Auction` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `Auction` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Auction` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `Auction` table. All the data in the column will be lost.
  - You are about to drop the column `starting_price` on the `Auction` table. All the data in the column will be lost.
  - The `id` column on the `Auction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Bid` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Bid` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `currentPrice` to the `Auction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Auction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Auction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startPrice` to the `Auction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Auction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Auction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Auction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Auction` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `auctionId` on the `Bid` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Auction" DROP CONSTRAINT "Auction_currentWinnerId_fkey";

-- DropForeignKey
ALTER TABLE "Auction" DROP CONSTRAINT "Auction_productId_fkey";

-- DropForeignKey
ALTER TABLE "Bid" DROP CONSTRAINT "Bid_auctionId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_userId_fkey";

-- DropIndex
DROP INDEX "Auction_productId_key";

-- AlterTable
ALTER TABLE "Auction" DROP CONSTRAINT "Auction_pkey",
DROP COLUMN "currentBid",
DROP COLUMN "currentWinnerId",
DROP COLUMN "end_date",
DROP COLUMN "productId",
DROP COLUMN "start_date",
DROP COLUMN "starting_price",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "currentPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "startPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Auction_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Bid" DROP CONSTRAINT "Bid_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "bidTime" DROP DEFAULT,
DROP COLUMN "auctionId",
ADD COLUMN     "auctionId" INTEGER NOT NULL,
ADD CONSTRAINT "Bid_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Product";

-- AddForeignKey
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
