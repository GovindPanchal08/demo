import config from "./config";

export const twilioClient = require("twilio")(
    config.TWILIO_SID,
    config.TWILIO_AUTH_TOKEN
);

export const WHATSAPP_FROM = "whatsapp:+14155238886"; // Twilio sandbox number
