import { Response } from "express";
import { AuthRequest } from "../../types/auth.types";
import { previewCoverLetterService, downloadCoverLetterService, getCoverLetterTemplatesService, getSummarySuggestionsService } from "../../services/coverLetter/coverLetter.service";

export const getCoverLetterTemplates = async (req: AuthRequest, res: Response) => {
    try {
        const templates = await getCoverLetterTemplatesService();
        return res.status(200).json({ success: true, templates });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const previewCoverLetter = async (req: AuthRequest, res: Response) => {
    try {
        const { templateKey = "classic", ...data } = req.body;
        const result = previewCoverLetterService(templateKey, data);
        return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const downloadCoverLetter = async (req: AuthRequest, res: Response) => {
    try {
        const { templateKey = "classic", ...data } = req.body;
        const pdf = await downloadCoverLetterService(templateKey, data);
        const safeName = (data.fullName || "Cover_Letter").replace(/[^\w\- ]/g, "").trim() || "Cover_Letter";

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${safeName}_Cover_Letter.pdf"`);
        return res.send(pdf);
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const getSummarySuggestions = async (req: AuthRequest, res: Response) => {
    try {
        const { jobTitle, companyName, excludeSummaries } = req.body;
        const result = await getSummarySuggestionsService(jobTitle, companyName, excludeSummaries || []);
        return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};