import prisma from "../../../prisma/client";
import AppError from "../../core/errors/appError";

class RoleService {

    createRole = async (title: string, type: any) => {
        const role = await prisma.role.create({
            data: {
                title,
                type,
            },
        });
        return role;
    };
    getAllRoles = async () => {
        return prisma.role.findMany({
            orderBy: { id: "asc" },
        });
    };
    getRoleById = async (id: number) => {
        return prisma.role.findUnique({
            where: { id },
        });
    };
    updateRole = async (
        id: number,
        title: string,
        type: any

    ) => {
        return prisma.role.update({
            where: { id },
            data: {
                title: title,
                type: type
            }
        });
    };
    deleteRole = async (id: number) => {
        return prisma.role.delete({
            where: { id },
        });
    };
}

export default new RoleService()