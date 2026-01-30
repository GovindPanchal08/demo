import express from "express";
import { protect, checkPermission } from "../../middlewares/auth.middleware";
import DepartmentController from "./department.controller";

const router = express.Router();
const departmentController = new DepartmentController();

router.use(protect);

router.post(
    "/",
    checkPermission("department.create"),
    departmentController.createDepartment
);

router.get(
    "/",
    checkPermission("department.read"),
    departmentController.getDepartments
);

router.get(
    "/:id",
    checkPermission("department.read"),
    departmentController.getDepartmentById
);

router.put(
    "/:id",
    checkPermission("department.update"),
    departmentController.updateDepartment
);

router.delete(
    "/:id",
    checkPermission("department.delete"),
    departmentController.deleteDepartment
);

export default router;
