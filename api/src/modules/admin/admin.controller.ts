import { NextFunction, Request, Response } from "express";
import adminService from "../admin/admin.service";
import prisma from "../../../prisma/client";
import { generateQRCode } from "../../utils/qrGeneration";
import { sendMail } from "../../utils/notify/sendEmail";
import { sendVisitApprovedMail } from "../../utils/mail/sendVisitApprovedMail";
// import { saveBase64QR } from "../../../utils/file";
// import { sendWhatsAppImage } from "../../../utils/notify/sms";

class AdminController {
  async approveVisit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await adminService.approveVisit(req.body.visitId);
      console.log(result)
      if (result) {
        const badge = await prisma.badge.findFirst({
          where: { id: Number(result.badge_id) },
        });
        console.log(badge)
        if (badge) {
          const payload = {
            // visitId: result.id,
            // badgeId: badge.id,
            // validFrom: result.time_from,
            // validTo: result.time_to,
            visitorUuid: result.visitor.uuid,
          };

          await prisma.badge.update({
            where: { id: badge.id },
            data: {
              qr_code: JSON.stringify(payload),
            },
          });

          const qr = await generateQRCode(JSON.stringify(payload));
          await sendVisitApprovedMail(result, qr);
        }
      }
      res
        .status(200)
        .json({ success: true, message: "Visit approved", data: result });
    } catch (err: any) {
      console.log(err);
      next(err)
    }
  }

  async flagHost(req: Request, res: Response): Promise<void> {
    try {
      const { hostId } = req.params;
      const { isEnabled } = req.body;

      const result = await adminService.flagHost(Number(hostId), isEnabled);
      res
        .status(200)
        .json({ success: true, message: "Host updated", data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async getAllHosts(req: Request, res: Response): Promise<void> {
    try {
      const hosts = await adminService.getAllHosts();
      res.status(200).json({ success: true, data: hosts });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async getAllVisitors(req: Request, res: Response): Promise<void> {
    try {
      const visitors = await adminService.getAllVisitors();
      res.status(200).json({ success: true, data: visitors });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}

export default new AdminController();
