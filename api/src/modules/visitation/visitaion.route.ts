import express from "express";
import VisitationController from "./visitation.controller";
import { validate } from "../../middlewares/validate";
import { CreateVisitorWithVisitSchema } from "./visitation.validator";
import {
  protect,
  checkPermission,
} from "../../middlewares/auth.middleware";

const router = express.Router();
router.use(protect);

router.post(
  "/",
  checkPermission("visitation.create"),
  validate({ body: CreateVisitorWithVisitSchema }),
  VisitationController.createVisitation
);

router.post(
  "/group",
  checkPermission("visitation.create"),
  validate({ body: CreateVisitorWithVisitSchema }),
  VisitationController.createBulkVisitorWithVisitation
);

router.patch(
  "/",
  checkPermission("visitation.update"),
  validate({ body: CreateVisitorWithVisitSchema }),
  VisitationController.updateVisitation
);

router.get(
  "/",
  checkPermission("visitation.read"),
  VisitationController.getAllVisitations
);

router.get(
  "/:visitationId",
  checkPermission("visitation.read"),
  VisitationController.getVisitation
);

router.patch("/:visitId/assign", checkPermission("visitation.update"), VisitationController.assign)


// check-in and out 
router.post(
  "/check-in",
  checkPermission("visitation.update"),
  VisitationController.checkInVisitor
);
router.post(
  "/check-out",
  checkPermission("visitation.update"),
  VisitationController.checkOutVisitor
);

// request-to-admin
router.post(
  "/request-to-admin",
  checkPermission("visitation.create"),
  VisitationController.requestToAdmin
);
router.get(
  "/my-visitors/:hostId",
  checkPermission("visitation.read"),
  VisitationController.getMyVisitors
);

export default router;
