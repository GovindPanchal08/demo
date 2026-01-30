import { sendMail } from "../notify/sendEmail";
import { visitApprovedVisitorTemplate } from "./templates/visit-approved.visitor";

export const sendVisitApprovedMail = async (visit: any, qr: string) => {


    const template = visitApprovedVisitorTemplate({
        visitorName: visit.visitor.name,
        hostName: visit.host?.name ?? "N/A",
        purpose: visit.visitor.purpose,
        date: visit.time_from.toDateString(),
        time: `${visit.time_from.toLocaleTimeString()} - ${visit.time_to?.toLocaleTimeString()}`,
        badgeId: visit.badge_id,
        qrBase64: qr,
    });

    await sendMail(visit.visitor.email, template.subject, {
        text: template.text,
        html: template.html,
        attachments: [
            {
                filename: "visit-qr.png",
                content: Buffer.from(qr.split(",")[1], "base64"),
            },
        ],
    });
};
