import { Request, Response } from "express";
import { getResumeStatsService } from "../../services/stats/stats.service";

export const getResumeStats = async (req: Request, res: Response) => {
    try {
        const stats = await getResumeStatsService();
        return res.status(200).json({ success: true, ...stats });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};