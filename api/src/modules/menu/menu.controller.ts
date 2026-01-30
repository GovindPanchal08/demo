import { Request, Response } from "express";
import prisma from "../../../prisma/client";
import menuService from "./menu.service";
class MenuController {
    async createMenu(req: Request, res: Response) {
        try {
            const { title, slug, parentId } = req.body;
            const menu = await menuService.createMenu({ title, slug, parentId });
            res.status(201).json(menu);
        } catch (err: any) {
            console.log(err)
            res.status(400).json({ error: err.message });
        }
    }

    async updateMenu(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const { title, slug, parentId } = req.body;
            const menu = await menuService.updateMenu(id, { title, slug, parentId });
            res.json(menu);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    async deleteMenu(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const menu = await menuService.deleteMenu(id);
            res.json({ message: "Menu deleted", menu });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    async getOneMenu(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const menu = await menuService.getOneMenu(id);
            if (!menu) return res.status(404).json({ message: "Menu not found" });
            res.json({ menu });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    async getAllMenus(req: Request, res: Response) {
        try {
            const menus = await menuService.getAllMenus();
            res.json({ menus });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    async getMenuTree(req: Request, res: Response) {
        const menus = await menuService.getMenuTree();
        res.json({ menus });
    }

    async getActionMenus(req: Request, res: Response) {
        return await menuService.getActionMenus()
    }
}

export default new MenuController()