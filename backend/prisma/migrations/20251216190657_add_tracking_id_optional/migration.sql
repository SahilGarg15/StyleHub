/*
  Warnings:

  - A unique constraint covering the columns `[trackingId]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "trackingId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "orders_trackingId_key" ON "orders"("trackingId");
