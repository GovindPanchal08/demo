import { subscribeToQueue } from "./broker";
import { sendMail } from "../../utils/notify/sendEmail";
module.exports = function () {
  subscribeToQueue("AUTH_NOTIFY.USER_CREATED", async (data: any) => {
    const emailHtmlTemplate = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#111;">
      <p>Thanks for registering${data.username ? `, ${data.username}` : ""}.</p>
      <p>Best regards,<br/>${data.appName || "The Team"}</p>
    </div>
    `;

    const emailText = `Thanks for registering${
      data.username ? `, ${data.username}` : ""
    }.\n\nBest regards,\n${data.appName || "The Team"}`;
    const subject = `Welcome to ${data.appName || "our service"}`;

    await sendMail(data?.email, subject, {
      text: emailText,
      html: emailHtmlTemplate,
    });
  });
};
