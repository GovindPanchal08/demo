import fs from "fs";
import path from "path";

export function saveBase64QR(base64: string, filename: string): string {
  const qrDir = path.join(__dirname, "..", "public", "qr");

  // Ensure folder exists
  if (!fs.existsSync(qrDir)) {
    fs.mkdirSync(qrDir, { recursive: true });
  }

  const filePath = path.join(qrDir, filename);
  const buffer = Buffer.from(base64, "base64");

  fs.writeFileSync(filePath, buffer);

  return filePath;
}
