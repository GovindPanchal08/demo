export const visitCreatedVisitorTemplate = (data: {
    visitorName: string;
    hostName: string;
    purpose: string;
    date: string;
    time: string;
    facilities: string;
}) => {
    return {
        subject: "Your visit has been scheduled",
        text: `
Hello ${data.visitorName},

Your visit has been successfully scheduled.

Visit Details:
- Host: ${data.hostName}
- Purpose: ${data.purpose}
- Date: ${data.date}
- Time: ${data.time}
- Facility: ${data.facilities}

Current Status: Pending approval

You will receive another email once your visit is approved.

Thank you.
    `.trim(),

        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Visit Scheduled</h2>

        <p>Hello <strong>${data.visitorName}</strong>,</p>

        <p>Your visit has been successfully scheduled with the following details:</p>

        <table cellpadding="6" cellspacing="0">
          <tr>
            <td><strong>Host</strong></td>
            <td>${data.hostName}</td>
          </tr>
          <tr>
            <td><strong>Purpose</strong></td>
            <td>${data.purpose}</td>
          </tr>
          <tr>
            <td><strong>Date</strong></td>
            <td>${data.date}</td>
          </tr>
          <tr>
            <td><strong>Time</strong></td>
            <td>${data.time}</td>
          </tr>
          <tr>
            <td><strong>Facility</strong></td>
            <td>${data.facilities}</td>
          </tr>
          <tr>
            <td><strong>Status</strong></td>
            <td>Pending approval</td>
          </tr>
        </table>

        <p style="margin-top:16px;">
          You will receive another email once your visit is approved.
        </p>

        <p>Thank you.</p>
      </div>
    `,
    };
};
