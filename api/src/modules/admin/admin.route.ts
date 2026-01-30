import express from "express";
import adminController from "../admin/admin.controller";
import {
  protect,
  checkPermission,
} from "../../middlewares/auth.middleware";
import cacheResponse from "../../middlewares/redisRoute.middleware";

const router = express.Router();

router.use(protect);
router.patch(
  "/approve-visit",
  checkPermission("approvals.create"),
  // cacheResponse(() => "admin:approveVisit", 100),
  adminController.approveVisit
);

router.patch(
  "/flag-host/:hostId",
  checkPermission("host.update"),
  adminController.flagHost
);

router.get(
  "/hosts",
  checkPermission("host.read"),
  // cacheResponse(() => "admin:hosts", 120),
  adminController.getAllHosts
);

router.get(
  "/visitors",
  checkPermission("visitor.read"),
  // cacheResponse(() => "admin:visitors", 120),
  adminController.getAllVisitors
);

export default router;
