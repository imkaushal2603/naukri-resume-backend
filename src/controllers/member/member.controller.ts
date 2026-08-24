import { getMemberStatusService } from "../../services/member/member.service";
import { AuthRequest } from "../../types/auth.types";
import { Response } from "express";

export const getMemberStatus = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const status = await getMemberStatusService(userId);

        return res.status(200).json({
            success: true,
            status,
        });

    } catch (error) {
        console.error("Payment status error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get payment status",
        });
    }
};
