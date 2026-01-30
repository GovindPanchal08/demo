-- CreateEnum
CREATE TYPE "userStatus" AS ENUM ('created', 'active', 'deactive');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "userStatus" NOT NULL DEFAULT 'created',
ALTER COLUMN "password" DROP NOT NULL;
