import express from "express";
import { protect, checkPermission } from "../../middlewares/auth.middleware";
import menuController from "./menu.controller";

const router = express.Router();

router.use(protect);

router.post(
    "/",
    checkPermission("menu.create"),
    menuController.createMenu
);

router.get(
    "/",
    checkPermission("menu.read"),
    menuController.getAllMenus
);

router.get(
    "/tree",
    checkPermission("menu.read"),
    menuController.getMenuTree
);

router.get(
    "/actions",
    checkPermission("menu.read"),
    menuController.getActionMenus
);

router.get(
    "/:id",
    checkPermission("menu.read"),
    menuController.getOneMenu
);

router.patch(
    "/:id",
    checkPermission("menu.update"),
    menuController.updateMenu
);

router.delete(
    "/:id",
    checkPermission("menu.delete"),
    menuController.deleteMenu
);


export default router;
