import prisma from "../../../prisma/client";
import AppError from "../../core/errors/appError";


class MenuService {
    async createMenu(data: {
        title: string;
        slug: string;
        parentId?: number;
    }) {
        const exists = await prisma.menu.findFirst({
            where: {
                slug: data.slug,
                parentId: data.parentId ?? null,
            },
        });

        if (exists) {
            throw new AppError("Menu already exists", 409);
        }

        if (data.parentId) {
            const parentMenu = await prisma.menu.findUnique({
                where: { id: data.parentId },
            });

            if (!parentMenu) {
                throw new AppError("Parent menu not found", 404);
            }
        }

        return prisma.menu.create({
            data: {
                title: data.title,
                slug: data.slug,
                parentId: data.parentId ?? null,
            },
        });
    }

    async updateMenu(
        id: number,
        data: {
            title?: string;
            slug?: string;
            parentId?: number | null;
        }
    ) {
        const menu = await prisma.menu.findUnique({
            where: { id },
            include: { children: true },
        });

        if (!menu) {
            throw new AppError("Menu not found", 404);
        }

        if (data.parentId !== undefined && data.parentId !== menu.parentId) {
            throw new AppError("Changing parent is not allowed", 400);
        }

        if (menu.parentId !== null) {
            if (data.slug) {
                throw new AppError("Action slug cannot be changed", 400);
            }

            return prisma.menu.update({
                where: { id },
                data: {
                    title: data.title,
                },
            });
        }

        // 🔐 parent slug uniqueness
        if (data.slug && data.slug !== menu.slug) {
            const exists = await prisma.menu.findFirst({
                where: {
                    slug: data.slug,
                    parentId: null,
                },
            });

            if (exists) {
                throw new AppError("Menu slug already exists", 409);
            }
        }

        return prisma.$transaction(async (tx) => {
            const updatedParent = await tx.menu.update({
                where: { id },
                data: {
                    title: data.title,
                    slug: data.slug,
                },
            });

            if (data.slug && data.slug !== menu.slug) {
                for (const child of menu.children) {
                    const action = child.slug.split(".").pop();
                    await tx.menu.update({
                        where: { id: child.id },
                        data: {
                            slug: `${data.slug}.${action}`,
                        },
                    });
                }
            }

            return updatedParent;
        });
    }

    async deleteMenu(id: number) {
        const menu = await prisma.menu.findUnique({
            where: { id },
            include: { children: true },
        });

        if (!menu) {
            throw new AppError("Menu not found", 404);
        }


        if (menu.children.length > 0) {
            throw new AppError(
                "Delete sub-menus/actions first",
                400
            );
        }

        return prisma.menu.delete({
            where: { id },
        });
    }

    async getOneMenu(id: number) {
        const menu = await prisma.menu.findUnique({
            where: { id },
            include: {
                parent: true,
                children: true, // actions
            },
        });

        if (!menu) {
            throw new AppError("Menu not found", 404);
        }

        return menu;
    }

    async getAllMenus() {
        return prisma.menu.findMany({
            include: {
                parent: true,
                children: true,
            },
            orderBy: [{ parentId: "asc" }, { id: "asc" }],
        });
    }

    async getMenuTree() {
        const menus = await prisma.menu.findMany({
            orderBy: { id: "asc" },
        });

        const map = new Map<number, any>();
        const tree: any[] = [];

        menus.forEach(menu => {
            map.set(menu.id, { ...menu, children: [] });
        });

        menus.forEach(menu => {
            if (menu.parentId) {
                map.get(menu.parentId)?.children.push(map.get(menu.id));
            } else {
                tree.push(map.get(menu.id));
            }
        });

        return tree;
    }

    async getActionMenus() {
        return prisma.menu.findMany({
            where: { parentId: { not: null } },
            orderBy: { id: "asc" },
        });
    }
}

export default new MenuService()