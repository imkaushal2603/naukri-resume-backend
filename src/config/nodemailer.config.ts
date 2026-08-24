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