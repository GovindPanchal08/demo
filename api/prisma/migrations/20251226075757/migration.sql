/*
  Warnings:

  - You are about to drop the `role_permissions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_menuId_fkey";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_roleId_fkey";

-- DropTable
DROP TABLE "role_permissions";

-- CreateTable
CREATE TABLE "role_menus" (
    "roleId" INTEGER NOT NULL,
    "menuIds" INTEGER[],
    "menuId" INTEGER,

    CONSTRAINT "role_menus_pkey" PRIMARY KEY ("roleId")
);

-- CreateIndex
CREATE INDEX "role_menus_roleId_idx" ON "role_menus"("roleId");

-- CreateIndex
CREATE INDEX "role_menus_menuIds_idx" ON "role_menus"("menuIds");

-- AddForeignKey
ALTER TABLE "role_menus" ADD CONSTRAINT "role_menus_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_menus" ADD CONSTRAINT "role_menus_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "menus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
