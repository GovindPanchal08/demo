import { Request, Response } from "express";
import userService from "./user.service";

class UserController {
    createUser = async (req: Request, res: Response) => {
        const { name, email, roleId, department, group_id } = req.body;

        const user = await userService.createUser({
            name,
            email,
            roleId,
            department,
            group_id,
        });

        return res.status(201).json({
            success: true,
            data: user,
        });
    };

    updateUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = await userService.updateUser(Number(id), req.body);

        return res.status(200).json({
            success: true,
            data: user,
        });
    };

    deleteUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        await userService.deleteUser(Number(id));

        return res.status(200).json({
            success: true,
        });
    };

    getUser = async (_req: Request, res: Response) => {
        const users = await userService.getUser();

        return res.status(200).json({
            success: true,
            data: users,
        });
    };

    getOneUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = await userService.getOneUser(Number(id));

        return res.status(200).json({
            success: true,
            data: user,
        });
    };
}

export default new UserController();
