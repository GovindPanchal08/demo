import nodemailer from "nodemailer";
import config from "../config/config";

export const createTransporter = async () => {
  try {
    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     type: "OAuth2",
    //     user: config.GMAIL_USER,
    //     clientId: config.GOOGLE_CLIENT_ID,
    //     clientSecret: config.GOOGLE_CLIENT_SECRET,
    //     refreshToken: config.GOOGLE_REFRESH_TOKEN,
    //   },
    // });
    // Transporter Configuration (Connection)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: config.SMTP_PORT,
      secure: false, // use TLS
      auth: {
        user: config.SMTP_USER,   // myemail@gmail.com
        pass: config.SMTP_PASS // abcdefghij123456
      }
    });

    await transporter.verify();
    console.log("✅ Mail transporter ready to send messages");
    return transporter;
  } catch (error) {
    console.error("❌ Failed to create mail transporter:", error);
    throw error;
  }
};

export default { createTransporter };
