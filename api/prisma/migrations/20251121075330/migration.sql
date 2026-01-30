/*
  Warnings:

  - You are about to drop the column `appointment_id` on the `Visit` table. All the data in the column will be lost.
  - You are about to drop the `Appointment` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `status` on table `Visit` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_host_id_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_visitor_id_fkey";

-- DropForeignKey
ALTER TABLE "Visit" DROP CONSTRAINT "Visit_appointment_id_fkey";

-- AlterTable
ALTER TABLE "Visit" DROP COLUMN "appointment_id",
ADD COLUMN     "host_id" INTEGER,
ADD COLUMN     "preregistered" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "time_from" TIMESTAMP(3),
ADD COLUMN     "time_to" TIMESTAMP(3),
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'pending';

-- DropTable
DROP TABLE "Appointment";

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
