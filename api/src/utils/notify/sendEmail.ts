import { SentMessageInfo } from "nodemailer";
import { createTransporter } from "../../config/email";
import config from "../../config/config";
import { Attachment } from "nodemailer/lib/mailer";


export const sendMail = async (
  to: string,
  subject: string,
  options?: {
    text?: string;
    html?: string;
    attachments?: Attachment[]; // correct type
  }
): Promise<SentMessageInfo> => {
  const transporter = await createTransporter(); // create ONCE

  const mailOptions: any = {
    from: `"${config.SMTP_USER}" <${config.SMTP_FROM_EMAIL}>`,
    to,
    subject,
  };

  if (options?.text) mailOptions.text = options.text;
  if (options?.html) mailOptions.html = options.html;
  if (options?.attachments) mailOptions.attachments = options.attachments;

  return transporter.sendMail(mailOptions);
};
