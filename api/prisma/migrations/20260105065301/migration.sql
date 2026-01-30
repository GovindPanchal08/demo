/*
  Warnings:

  - You are about to drop the column `department_id` on the `visits` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "visits" DROP CONSTRAINT "visits_department_id_fkey";

-- DropIndex
DROP INDEX "visits_checkin_time_idx";

-- DropIndex
DROP INDEX "visits_checkout_time_idx";

-- DropIndex
DROP INDEX "visits_created_at_idx";

-- DropIndex
DROP INDEX "visits_department_id_idx";

-- DropIndex
DROP INDEX "visits_host_id_idx";

-- DropIndex
DROP INDEX "visits_status_idx";

-- DropIndex
DROP INDEX "visits_visitor_id_idx";

-- AlterTable
ALTER TABLE "visits" DROP COLUMN "department_id";

-- CreateTable
CREATE TABLE "visit_departments" (
    "id" SERIAL NOT NULL,
    "visit_id" INTEGER NOT NULL,
    "department_id" INTEGER NOT NULL,

    CONSTRAINT "visit_departments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "visit_departments_visit_id_idx" ON "visit_departments"("visit_id");

-- CreateIndex
CREATE INDEX "visit_departments_department_id_idx" ON "visit_departments"("department_id");

-- CreateIndex
CREATE UNIQUE INDEX "visit_departments_visit_id_department_id_key" ON "visit_departments"("visit_id", "department_id");

-- AddForeignKey
ALTER TABLE "visit_departments" ADD CONSTRAINT "visit_departments_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "visits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_departments" ADD CONSTRAINT "visit_departments_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
