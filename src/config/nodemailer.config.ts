import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendResetPasswordEmail = async (to: string, resetLink: string) => {
    await transporter.sendMail({
        from: `"Support Team" <${process.env.SMTP_USER}>`,
        to,
        subject: "Reset Your Password",
        html: `
      <p>You requested a password reset.</p>
      <p>Click the link below to set a new password. This link is valid for 15 minutes:</p>
      <a href="${resetLink}">${resetLink}</a>
    `,
    });
};

export const sendSupportTicketEmail = async (
    userEmail: string,
    userName: string,
    subject: string,
    message: string,
    attachmentPath?: string
) => {
    await transporter.sendMail({
        from: `"Naukri Resume Support" <${process.env.SMTP_USER}>`,
        to: process.env.SUPPORT_EMAIL || process.env.SMTP_USER,
        replyTo: userEmail,
        subject: `[Support Ticket] ${subject} — from ${userName}`,
        html: `
            <p><strong>From:</strong> ${userName} (${userEmail})</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, "<br/>")}</p>
        `,
        ...(attachmentPath && { attachments: [{ path: attachmentPath }] }),
    });
};