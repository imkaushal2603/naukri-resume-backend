import { Response } from "express";
import { AuthRequest } from "../../types/auth.types";
import { prisma } from "../../config/database.config";
import { sendSupportTicketEmail } from "../../config/nodemailer.config";

export const submitSupportTicket = async (req: AuthRequest, res: Response) => {
    try {
        const { subject, message } = req.body;
        if (!subject || !message?.trim()) {
            return res.status(400).json({ success: false, message: "Subject and message are required." });
        }

        const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
        if (!user) return res.status(404).json({ success: false, message: "User not found." });

        const attachmentPath = req.file ? req.file.path : undefined;

        await sendSupportTicketEmail(user.email, user.name, subject, message, attachmentPath);

        return res.status(200).json({ success: true, message: "Support ticket submitted successfully." });
    } catch (error: any) {
        console.error("Support ticket error:", error);
        return res.status(500).json({ success: false, message: "Failed to submit support ticket." });
    }
};