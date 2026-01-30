export const visitApprovedVisitorTemplate = (data: {
  visitorName: string;
  hostName: string;
  purpose: string;
  date: string;
  time: string;
  badgeId: number;
  qrBase64: string;
}) => {
  return {
    subject: "Your visit has been approved",

    text: `
Hello ${data.visitorName},

Your visit has been approved.

Visit Details:
- Host: ${data.hostName}
- Purpose: ${data.purpose}
- Date: ${data.date}
- Time: ${data.time}
- Badge ID: ${data.badgeId}

Please present the attached QR code at the security desk during arrival.

Thank you.
    `.trim(),

    html: `
      <div style="font-family: Arial, sans-serif; color:#333; line-height:1.6;">
        <h2 style="color:#0a58ca;">Visit Approved</h2>

        <p>Hello <strong>${data.visitorName}</strong>,</p>

        <p>Your visit has been <strong>approved</strong>. Please find the details below:</p>

        <table cellpadding="6" cellspacing="0">
          <tr><td><strong>Host</strong></td><td>${data.hostName}</td></tr>
          <tr><td><strong>Purpose</strong></td><td>${data.purpose}</td></tr>
          <tr><td><strong>Date</strong></td><td>${data.date}</td></tr>
          <tr><td><strong>Time</strong></td><td>${data.time}</td></tr>
          <tr><td><strong>Badge ID</strong></td><td>${data.badgeId}</td></tr>
        </table>

        <p style="margin-top:16px;">
          Please present the QR code below at the security desk during arrival.
        </p>

        <div style="margin-top:12px;">
          <img src="${data.qrBase64}" alt="QR Code" width="180" />
        </div>

        <p style="margin-top:16px; font-size: 13px; color:#666;">
          This QR code is valid only for the scheduled date and time.
        </p>
      </div>
    `,
  };
};
