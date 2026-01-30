import DepartmentService from "./department.service";
import { Request, Response } from "express";
import adminService from "../admin/admin.service";
import prisma from "../../../prisma/client";

class DepartmentController {
    private departmentService: DepartmentService;

    constructor() {
        this.departmentService = new DepartmentService();
    }

    createDepartment = async (req: Request, res: Response) => {
        try {
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ error: "Department name is required" });
            }

            const department = await prisma.department.create({
                data: { name },
            });

            return res.status(201).json({
                message: "Department created successfully",
                department,
            });
        } catch (err: any) {
            console.error("Create Department Error:", err);
            res.status(500).json({ error: err.message });
        }
    };

    getDepartments = async (req: Request, res: Response) => {
        try {
            const departments = await prisma.department.findMany({
                orderBy: { id: "desc" },
            });

            return res.json({ departments });
        } catch (err: any) {
            console.error("Get Departments Error:", err);
            res.status(500).json({ error: err.message });
        }
    };

    getDepartmentById = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            const department = await prisma.department.findUnique({
                where: { id },
            });

            if (!department) {
                return res.status(404).json({ error: "Department not found" });
            }

            return res.json({ department });
        } catch (err: any) {
            console.error("Get Department Error:", err);
            res.status(500).json({ error: err.message });
        }
    };

    updateDepartment = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const { name } = req.body;

            if (!name) {
                return res.status(400).json({ error: "Department name is required" });
            }

            const updated = await prisma.department.update({
                where: { id },
                data: { name },
            });

            return res.json({
                message: "Department updated successfully",
                department: updated,
            });
        } catch (err: any) {
            console.error("Update Department Error:", err);
            res.status(500).json({ error: err.message });
        }
    };

    deleteDepartment = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            await prisma.department.delete({
                where: { id },
            });

            return res.json({ message: "Department deleted successfully" });
        } catch (err: any) {
            console.error("Delete Department Error:", err);
            res.status(500).json({ error: err.message });
        }
    };

    respondToRequest = async (req: Request, res: Response) => {
        try {
            const adminId = req.user?.id;
            const { requestId, status, adminMessage } = req.body;

            if (!adminId) {
                return res.status(401).json({ error: "Unauthorized admin" });
            }

            if (!requestId || !status) {
                return res.status(400).json({
                    error: "requestId and status are required",
                });
            }

            if (!["approved", "rejected"].includes(status)) {
                return res.status(400).json({
                    error: "Invalid status. Must be approved or rejected",
                });
            }

            const response = await adminService.respondToRequest(
                Number(requestId),
                status,
                adminMessage
            );

            return res.json({
                message: `Request ${status} successfully`,
                data: response,
            });
        } catch (err: any) {
            console.error("Admin Response Error:", err);
            return res.status(500).json({
                error: "Internal server error",
                details: err.message,
            });
        }
    };

}
export default DepartmentController