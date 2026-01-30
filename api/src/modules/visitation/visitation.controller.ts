import VisitationService from "./visitation.service";
import { NextFunction, Request, Response } from "express";
import prisma from "../../../prisma/client";

interface CheckInBody {
  visitorId: number | string;
  badgeId: number | string;
}

class HostController {
  createVisitation = async (req: any, res: any, next: any) => {
    try {
      const result = await VisitationService.createVisitorWithVisitation(
        req.body,
        req.user
      );
      return res.status(201).json(result);
    } catch (error: any) {
      next(error);
    }
  };

  createBulkVisitorWithVisitation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await VisitationService.createBulkVisitorWithVisitation(
        req.body,
        req.user
      );

      return res.status(201).json(result);
    } catch (error: any) {
      next(error);
    }
  };

  updateVisitation = async (req: any, res: any) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid visitation ID" });
      }

      const result = await VisitationService.updateVisitation(
        id,
        req.body,
        req.user
      );

      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  getVisitation = async (req: any, res: any) => {
    try {
      const id = Number(req.params.visitationId);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid visitation ID" });
      }

      const result = await VisitationService.getVisitation(id);

      return res.json(result);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  };

  getAllVisitations = async (req: any, res: any) => {
    try {
      const result = await VisitationService.getAllVisitations();
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  //  visitors
  getVisitor = async (req: any, res: any) => {
    try {
      const id = Number(req.params.visitorId);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid visitor ID" });
      }

      const result = await VisitationService.getVisitor(id);
      if (!result)
        return res.status(404).json({ message: "Visitor not found" });

      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  updateVisitor = async (req: any, res: any) => {
    try {
      const id = Number(req.params.visitorId);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid visitor ID" });
      }

      const result = await VisitationService.updateVisitor(id, req.body);
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  getAllVisitor = async (req: any, res: any) => {
    try {
      const result = await VisitationService.getAllVisitors();
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  };

  // check in and out
  checkVisitor = async (
    req: Request,
    res: Response,
    type: "checkin" | "checkout"
  ) => {
    try {
      const { uuid } = req.body;
      if (!uuid) return res.status(400).json({ error: "UUID required" });

      const [visitor, visit] = await prisma.$transaction([
        prisma.visitor.findUnique({ where: { uuid } }),
        prisma.visit.findFirst({
          where: {
            visitor_id: { equals: undefined },
            checkout_time: null,
          },
          orderBy: { created_at: "desc" },
        }),
      ]);

      if (!visitor) return res.status(404).json({ error: "Invalid QR" });

      const activeVisit = await prisma.visit.findFirst({
        where: { visitor_id: visitor.id, checkout_time: null },
        orderBy: { created_at: "desc" },
      });

      if (!activeVisit)
        return res
          .status(404)
          .json({ error: "Visit not found or already checked out" });

      if (type === "checkin" && activeVisit.checkin_time)
        return res.status(400).json({ error: "Visitor already checked in" });

      if (type === "checkout" && !activeVisit.checkin_time)
        return res
          .status(400)
          .json({ error: "Visitor has not checked in yet" });

      const updatedVisit = await prisma.visit.update({
        where: { id: activeVisit.id },
        data: {
          checkin_time:
            type === "checkin" ? new Date() : activeVisit.checkin_time,
          checkout_time:
            type === "checkout" ? new Date() : activeVisit.checkout_time,
          status: type === "checkin" ? "checked_in" : "checked_out",
        },
      });

      return res.status(200).json({
        message: `${type === "checkin" ? "Check-in" : "Checkout"} successful`,
        visit: updatedVisit,
      });
    } catch (err: any) {
      console.error(`${type} error:`, err);
      return res
        .status(500)
        .json({ error: "Internal server error", details: err.message });
    }
  };
  checkInVisitor = (req: Request, res: Response) =>
    this.checkVisitor(req, res, "checkin");
  checkOutVisitor = (req: Request, res: Response) =>
    this.checkVisitor(req, res, "checkout");

  requestToAdmin = async (req: Request, res: Response) => {
    try {
      const hostId = req.user?.id; // If using auth middleware
      // console.log(req.user)
      const { message } = req.body;

      if (!hostId) {
        return res.status(401).json({ error: "Unauthorized host" });
      }

      const result = await VisitationService.requestToAdmin(hostId, message);

      return res.status(201).json({
        message: "Request sent to admin",
        request: result,
      });
    } catch (err: any) {
      console.error("Request-to-admin error:", err);
      return res.status(500).json({ error: err.message });
    }
  };
  getMyVisitors = async (req: Request, res: Response) => {
    try {
      const hostId = Number(req.params.host);
      const data = await prisma.visitor.findMany({
        where: {
          user_id: hostId,
        },
        include: {
          visits: true,
          created_by: true,
        },
      });
      if (!data) {
        return res.json("No visitors you have created ");
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json("something went wrog");
    }
  };

  assign = async (req: Request, res: Response) => { }
}

export default new HostController();
