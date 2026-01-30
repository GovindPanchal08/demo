-- AlterTable
ALTER TABLE "users" ADD COLUMN     "group_id" INTEGER;

-- AlterTable
ALTER TABLE "visitors" ADD COLUMN     "groupId" INTEGER;

-- CreateTable
CREATE TABLE "groups" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(150) NOT NULL,
    "lead_email" VARCHAR(320) NOT NULL,
    "size" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "groups_uuid_key" ON "groups"("uuid");

-- CreateIndex
CREATE INDEX "groups_uuid_idx" ON "groups"("uuid");

-- CreateIndex
CREATE INDEX "groups_lead_email_idx" ON "groups"("lead_email");

-- AddForeignKey
ALTER TABLE "visitors" ADD CONSTRAINT "visitors_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
