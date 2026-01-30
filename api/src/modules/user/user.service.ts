import { userStatus } from "@prisma/client";
import prisma from "../../../prisma/client"
import AppError from "../../core/errors/appError";

class UserService {
    createUser = async (data: {
        name: string;
        email: string;
        roleId?: number;
        department?: string;
        group_id?: number;
    }) => {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new AppError("User already exists", 400);
        }

        return prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                roleId: data.roleId,
                department: data.department,
                group_id: data.group_id,
                password: null,
                email_verified: false,
                isEnabled: true,
                active: userStatus.CREATED,
            },
            select: {
                id: true,
                name: true,
                email: true,
                roleId: true,
                active: true,
                isEnabled: true,
                createdAt: true,
            },
        });
    };

    updateUser = async (id: number, data: any) => {
        return prisma.user.update({
            where: { id },
            data,
        });
    };

    deleteUser = async (id: number) => {
        return prisma.user.update({
            where: { id },
            data: {
                isEnabled: false,
                active: userStatus.DISABLED,
            },
        });
    };

    getUser = async () => {
        return prisma.user.findMany({
            where: {
                isEnabled: true,
            },
            select: {
                id: true,
                name: true,
                email: true,
                roleId: true,
                active: true,
                createdAt: true,
            },
        });
    };

    getOneUser = async (id: number) => {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                roleId: true,
                active: true,
                isEnabled: true,
                createdAt: true,
            },
        });
    };
}

export default new UserService();
