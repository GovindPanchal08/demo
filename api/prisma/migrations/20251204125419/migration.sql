/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Visitor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Visitor" ADD COLUMN     "uuid" TEXT NOT NULL DEFAULT gen_random_uuid();

-- CreateIndex
CREATE UNIQUE INDEX "Visitor_uuid_key" ON "Visitor"("uuid");
