import { sendMail } from "../notify/sendEmail";
import { visitCreatedVisitorTemplate } from "./templates/visit.created.visitors";

export const sendVisitCreatedMail = async (visit: any) => {
    const facilities = visit.departments
        .map((d: any) => d.department.name)
        .join(", ");

    const template = visitCreatedVisitorTemplate({
        visitorName: visit.visitor.name,
        hostName: visit.host?.name ?? "N/A",
        purpose: visit.visitor.purpose,
        date: visit.time_from.toDateString(),
        time: `${visit.time_from.toLocaleTimeString()} - ${visit.time_to?.toLocaleTimeString()}`,
        facilities,
    });

    await sendMail(visit.visitor.email, template.subject, {
        text: template.text,
        html: template.html,
    });
};
