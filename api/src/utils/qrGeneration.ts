import QRCode from "qrcode";

export async function generateQRCode(text: string): Promise<string> {
    try {
        return await QRCode.toDataURL(text);
    } catch (err) {
        console.error(err);
        throw new Error("QR generation failed");
    }
}


// const qr = await generateQRCode("Hello Visitor 12345");
// console.log(qr);
