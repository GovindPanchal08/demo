// import { twilioClient, WHATSAPP_FROM } from "../../config/twilio";

// export async function sendWhatsAppMessage(
//     to: string,
//     body: string,
//     mediaUrl?: string // optional for sending QR images
// ) {
//     try {           
//         const msg = await twilioClient.messages.create({
//             from: WHATSAPP_FROM,
//             to: `whatsapp:${to}`, // your visitor’s phone
//             body,
//             mediaUrl: mediaUrl ? [mediaUrl] : undefined,
//         });

//         return msg;
//     } catch (err) {
//         console.error("WhatsApp error:", err);
//         throw new Error("Failed to send WhatsApp message");
//     }
// }


import axios from "axios";

export async function sendWhatsAppImage(
    phone: string,
    base64: string,
    caption?: string
) {
    const url = `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_ID}/messages`;

    return axios.post(
        url,
        {
            messaging_product: "whatsapp",
            to: phone,
            type: "image",
            image: {
                caption: caption || "",
                filename: "qr.png",
                // directly pass base64 string
                data: base64,
            },
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                "Content-Type": "application/json",
            },
        }
    );
}
