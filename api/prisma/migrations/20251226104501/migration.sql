/*
  Warnings:

  - A unique constraint covering the columns `[parentId,slug]` on the table `menus` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "menus_slug_key";

-- CreateIndex
CREATE INDEX "menus_slug_idx" ON "menus"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "menus_parentId_slug_key" ON "menus"("parentId", "slug");
