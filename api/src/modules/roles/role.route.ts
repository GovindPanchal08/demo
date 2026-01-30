import express from "express";
import RoleController from "./role.controller";
import { protect, checkPermission } from "../../middlewares/auth.middleware";
const router = express.Router();

router.use(protect);
router
    .route("/")
    .post(
        checkPermission("r&p.create"),
        RoleController.createRole
    )
    .get(
        checkPermission("r&p.read"),
        RoleController.getRole
    );

router
    .route("/:roleId")
    .get(
        checkPermission("r&p.read"),
        RoleController.getOneRole
    )
    .patch(
        checkPermission("r&p.update"),
        RoleController.updateRole
    )
    .delete(
        checkPermission("r&p.delete"),
        RoleController.deleteRole
    );

// roleAssign
router.post(
    "/rolemenu/assign-role",
    checkPermission("r&p.create"),
    RoleController.assignMenusToRole
);
router.get(
    "/rolemenu/:roleId",
    checkPermission("r&p.read"),
    RoleController.getRoleMenus
);
// router.put(
//   "/rolemenu/:roleId",
//   checkPermission("r&p.update"),
//   RoleController.updateRoleMenus
// );

router.delete(
    "/rolemenu/single/:roleMenuId",
    checkPermission("r&p.delete"),
    RoleController.removeMenuFromRole
);
router.delete(
    "/rolemenu/role/:roleId",
    checkPermission("r&p.delete"),
    RoleController.deleteAllMenusForRole
);

export default router;
