import { Request, Response } from "express";
import RoleService from "../roles/role.service";
import prisma from "../../../prisma/client";
class RoleController {

    createRole = async (req: Request, res: Response) => {
        try {
            const { title, type } = req.body;
            if (!title || typeof title !== "string")
                return res.json({ res, msg: "Role title is required" });

            const role = await RoleService.createRole(title, type.toLowerCase());

            return res.status(201).json({
                message: "successfully created",
                role,
            });
        } catch (e: any) {
            if (e.code === "P2002")
                return res.json({ res, err: "Role already exists" });
            return res.json(e);
        }
    };
    getRole = async (req: Request, res: Response) => {
        try {
            const roles = await RoleService.getAllRoles();
            return res.status(200).json({
                message: "success",
                roles,
            });
        } catch (e) {
            return res.json({ res, err: "Something went wrong" });
        }
    };
    getOneRole = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.roleId);
            console.log(id)
            if (!id) return res.json({ err: "Invalid ID" });

            const role = await RoleService.getRoleById(id);

            if (!role) return res.json({ err: "Role not found" });

            return res.status(200).json({
                message: "success",
                role,
            });
        } catch (e) {
            return res.json({ err: "Something went wrong" });
        }
    };
    updateRole = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.roleId);
            if (!id) return res.json({ res, err: "Invalid ID" });

            const { title, type } = req.body;

            const updatedRole = await RoleService.updateRole(id, title, type);

            return res.status(200).json({
                message: "updated successfully",
                role: updatedRole,
            });
        } catch (e: any) {
            if (e.code === "P2002")
                return res.json({ res, err: "Role name already exists" });

            return res.json({ res, err: "Something went wrong" });
        }
    };
    deleteRole = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.roleId);
            if (!id) return res.json({ res, err: "Invalid ID" });

            const role = await RoleService.getRoleById(id);

            if (!role) return res.json({ res, err: "Role not found" });

            // Block deletion of essential roles
            if (["admin", "superadmin"].includes(role.title.toLowerCase())) {
                return res.json({ res, err: "Cannot delete system role" });
            }

            await RoleService.deleteRole(id);

            return res.status(200).json({
                message: "Role deleted",
            });
        } catch (e) {
            return res.json({ res, err: "Something went wrong" });
        }
    };

    assignMenusToRole = async (req: Request, res: Response) => {
        try {
            const { roleId, menuIds } = req.body;

            if (!roleId || !Array.isArray(menuIds)) {
                return res.status(400).json({ msg: "Invalid payload" });
            }

            // ensure unique ids
            const uniqueMenuIds = [...new Set(menuIds.map(Number))];

            const permission = await prisma.roleMenu.upsert({
                where: { roleId },
                update: {
                    menuIds: uniqueMenuIds,
                },
                create: {
                    roleId,
                    menuIds: uniqueMenuIds,
                },
            });

            res.json({
                msg: "Role permissions updated successfully",
                permission,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: "Server error" });
        }
    };
    getRoleMenus = async (req: Request, res: Response) => {
        try {
            const roleId = Number(req.params.roleId);
            const permission = await prisma.roleMenu.findUnique({
                where: { roleId },
                select: { menuIds: true },
            });
            // console.log(permission)
            if (!permission) {
                return res.json({
                    roleId,
                    menus: [],
                });
            }

            const menus = await prisma.menu.findMany({
                where: {
                    id: {
                        in: permission.menuIds
                    },

                },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    parentId: true,
                    children: true,
                    parent: true
                },
                orderBy: { id: "asc" },
            });
            // console.log(menus)
            res.status(200).json({
                roleId,
                menus,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: "Server error" });
        }
    };

    removeMenuFromRole = async (req: Request, res: Response) => {
        try {
            const roleId = Number(req.params.roleId);
            const menuId = Number(req.params.menuId);

            const permission = await prisma.roleMenu.findUnique({
                where: { roleId },
            });

            if (!permission) {
                return res.status(404).json({ msg: "Role permission not found" });
            }

            const updatedMenuIds = permission.menuIds.filter(
                (id) => id !== menuId
            );

            await prisma.roleMenu.update({
                where: { roleId },
                data: { menuIds: updatedMenuIds },
            });

            res.json({ msg: "Menu removed from role" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: "Server error" });
        }
    };

    deleteAllMenusForRole = async (req: Request, res: Response) => {
        try {
            const roleId = Number(req.params.roleId);

            await prisma.roleMenu.delete({
                where: { roleId },
            });

            res.json({ msg: "All menus removed from this role" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: "Server error" });
        }
    };
}

export default new RoleController()