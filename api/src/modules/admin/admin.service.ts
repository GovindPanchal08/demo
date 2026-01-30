import prisma from "../../../prisma/client";
import AppError from "../../core/errors/appError";
import { sendMail } from "../../utils/notify/sendEmail";
class AdminService {
  async approveVisit(visitId: number) {
    const visit = await prisma.visit.findUnique({
      where: { id: Number(visitId) },
    });

    if (!visit) throw new AppError("Visit not found", 404);
    if (visit?.isApproved) {
      throw new AppError("Visit is already approved", 200);
    }

    const result = await prisma.$transaction(async (prisma) => {
      const updatedVisit = await prisma.visit.update({
        where: { id: visitId },
        data: {
          isApproved: true,
        },
        include: {
          visitor: true,
          departments: true,
        },
      });


      const departments = updatedVisit.departments;

      return updatedVisit;
    });

    return result;
  }

  async flagHost(hostId: number, isEnabled: boolean) {
    return prisma.user.update({
      where: { id: hostId },
      data: { isEnabled },
    });
  }

  async getAllHosts() {
    return prisma.user.findMany();
  }

  async getAllVisitors() {
    return prisma.visit.findMany({
      orderBy: { created_at: "desc" },
      include: {
        visitor: true,
        checkedUser: true,
      },
    });
  }

  async respondToRequest(
    requestId: number,
    status: "approved" | "rejected",
    adminMessage?: string
  ) {
    // 1. Get existing request
    const request = await prisma.guestRequest.findUnique({
      where: { id: requestId },
      include: { host: true },
    });

    if (!request) {
      throw new Error("Request not found");
    }

    // 2. Update request status
    const updated = await prisma.guestRequest.update({
      where: { id: requestId },
      data: {
        status,
        message: adminMessage || request.message,
      },
      include: {
        host: true,
      },
    });

    // 3. Notify host
    const host = updated.host;

    // Email Notification
    await sendMail(
      host.email,
      `Your guest request is ${status}`,

      { text: `Admin response: ${adminMessage || "No additional message"}` }
    );

    // // WhatsApp Notification
    // if (host.phone) {
    //   await sendWhatsAppMessage(
    //     host.phone,
    //     `Your Guest Request is *${status.toUpperCase()}*\nMessage: ${adminMessage || "No message"}`
    //   );
    // }

    return updated;
  }

}

export default new AdminService();
