import { RequestHandler, Response } from "express";
import { AuthRequest } from "../../types/auth.types";
import * as ResumeService from "../../services/resume/resume.service";

// 1. Get Templates
export const getTemplates = async (req: AuthRequest, res: Response) => {
    try {
        const templates = await ResumeService.getTemplatesService();
        return res.status(200).json({ success: true, templates });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// 2. Get ALL Resumes for the authenticated user
export const getAllResumes = async (req: AuthRequest, res: Response) => {
    try {
        const resumes = await ResumeService.getAllResumesService(req.user!.userId);
        return res.status(200).json({ success: true, resumes });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// 3. Get Single Resume by ID
export const getResumeById = async (req: AuthRequest, res: Response) => {
    try {
        const resumeId = Number(req.params.resumeId);
        if (isNaN(resumeId)) {
            return res.status(400).json({ success: false, message: "Invalid resume ID." });
        }

        const resume = await ResumeService.getResumeByIdService(req.user!.userId, resumeId);
        return res.status(200).json({ success: true, resume });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// 4. Create Resume Draft
export const createResumeBuilder = async (req: AuthRequest, res: Response) => {
    try {
        const resume = await ResumeService.createResumeBuilderService(req.user!.userId, req.body);
        return res.status(201).json({
            success: true,
            resume,
            message: "Resume Builder initialized successfully.",
        });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// 5. Update Resume Draft by resumeId
export const updateResumeBuilder = async (req: AuthRequest, res: Response) => {
    try {
        const resumeId = Number(req.params.resumeId);
        if (isNaN(resumeId)) {
            return res.status(400).json({ success: false, message: "Invalid resume ID." });
        }

        const resume = await ResumeService.updateResumeBuilderService(
            req.user!.userId,
            resumeId,
            req.body
        );
        return res.status(200).json({
            success: true,
            resume,
            message: "Resume Builder updated successfully.",
        });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// 6. Delete Resume Draft by resumeId
export const removeResumeBuilder = async (req: AuthRequest, res: Response) => {
    try {
        const resumeId = Number(req.params.resumeId);
        if (isNaN(resumeId)) {
            return res.status(400).json({ success: false, message: "Invalid resume ID." });
        }

        const result = await ResumeService.removeResumeBuilderService(req.user!.userId, resumeId);
        return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// 7. Preview Resume by resumeId
export const previewResume = async (req: AuthRequest, res: Response) => {
    try {
        const resumeId = Number(req.params.resumeId);
        if (isNaN(resumeId)) {
            return res.status(400).json({ success: false, message: "Invalid resume ID." });
        }

        const result = await ResumeService.previewResumeService(req.user!.userId, resumeId);
        return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// 8. Download Resume by resumeId
export const downloadResumeController = async (req: AuthRequest, res: Response) => {
    try {
        const resumeId = Number(req.params.resumeId);
        if (isNaN(resumeId)) {
            return res.status(400).json({ success: false, message: "Invalid resume ID." });
        }

        const { format = "pdf" } = req.query;
        const file = await ResumeService.downloadResumeService(
            req.user!.userId,
            resumeId,
            format as string
        );

        if (format === "docx") {
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            );
            res.setHeader("Content-Disposition", `attachment; filename=resume_${resumeId}.docx`);
        } else {
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename=resume_${resumeId}.pdf`);
        }

        return res.send(file);
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const regenerateThumbnail: RequestHandler = async (req: AuthRequest, res) => {
    try {
        const resumeId = Number(req.params.resumeId);
        const previewImage = await ResumeService.generateResumeThumbnailService(req.user!.userId, resumeId);
        return res.status(200).json({ success: true, previewImage });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// --- Basic Info Controllers ---
export const getBasicInfo: RequestHandler = async (req: AuthRequest, res) => {
    try {
        const resumeId = Number(req.params.resumeId);
        const info = await ResumeService.getBasicInfoService(req.user!.userId, resumeId);
        return res.status(200).json({ success: true, basicInfo: info });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const updateBasicInfo: RequestHandler = async (req: AuthRequest, res) => {
    try {
        const resumeId = Number(req.params.resumeId);
        const photoPath = req.file ? `/uploads/${req.file.filename}` : undefined;
        const info = await ResumeService.updateBasicInfoService(req.user!.userId, resumeId, req.body, photoPath);
        return res.status(200).json({ success: true, basicInfo: info });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// --- Education Controllers ---
export const getEducation: RequestHandler = async (req: AuthRequest, res) => {
    try {
        const resumeId = Number(req.params.resumeId);
        const list = await ResumeService.getEducationList(req.user!.userId, resumeId);
        return res.status(200).json({ success: true, education: list });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const addEducation: RequestHandler = async (req: AuthRequest, res) => {
    try {
        const resumeId = Number(req.params.resumeId);
        const record = await ResumeService.addEducation(req.user!.userId, resumeId, req.body);
        return res.status(201).json({ success: true, education: record });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const updateEducation: RequestHandler = async (req: AuthRequest, res) => {
    try {
        const resumeId = Number(req.params.resumeId);
        const record = await ResumeService.updateEducation(req.user!.userId, resumeId, Number(req.params.id), req.body);
        return res.status(200).json({ success: true, education: record });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteEducation: RequestHandler = async (req: AuthRequest, res) => {
    try {
        const resumeId = Number(req.params.resumeId);
        const result = await ResumeService.deleteEducation(req.user!.userId, resumeId, Number(req.params.id));
        return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// --- Experience Controllers ---
export const getExperience: RequestHandler = async (req: AuthRequest, res) => {
    try {
        const resumeId = Number(req.params.resumeId);
        const list = await ResumeService.getExperienceList(req.user!.userId, resumeId);
        return res.status(200).json({ success: true, experience: list });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const addExperience: RequestHandler = async (req: AuthRequest, res) => {
    try {
        const resumeId = Number(req.params.resumeId);
        const record = await ResumeService.addExperience(req.user!.userId, resumeId, req.body);
        return res.status(201).json({ success: true, experience: record });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const updateExperience: RequestHandler = async (req: AuthRequest, res) => {
    try {
        const resumeId = Number(req.params.resumeId);
        const record = await ResumeService.updateExperience(
            req.user!.userId,
            resumeId,
            Number(req.params.id),
            req.body
        );
        return res.status(200).json({ success: true, experience: record });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteExperience: RequestHandler = async (req: AuthRequest, res) => {
    try {
        const resumeId = Number(req.params.resumeId);
        const result = await ResumeService.deleteExperience(
            req.user!.userId,
            resumeId,
            Number(req.params.id)
        );
        return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// --- Skills Controllers ---
export const getSkills: RequestHandler = async (req: AuthRequest, res) => {
    try {
        const resumeId = Number(req.params.resumeId);
        const list = await ResumeService.getSkillsList(req.user!.userId, resumeId);
        return res.status(200).json({ success: true, skills: list });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const addSkill: RequestHandler = async (req: AuthRequest, res) => {
    try {
        const resumeId = Number(req.params.resumeId);
        const skill = await ResumeService.addSkill(
            req.user!.userId,
            resumeId,
            req.body.name,
            req.body.level
        );
        return res.status(201).json({ success: true, skill });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteSkill: RequestHandler = async (req: AuthRequest, res) => {
    try {
        const resumeId = Number(req.params.resumeId);
        const result = await ResumeService.deleteSkill(
            req.user!.userId,
            resumeId,
            Number(req.params.id)
        );
        return res.status(200).json({ success: true, ...result });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// --- Summary Controllers ---
export const getSummary: RequestHandler = async (req: AuthRequest, res) => {
    try {
        const resumeId = Number(req.params.resumeId);
        const data = await ResumeService.getSummaryService(req.user!.userId, resumeId);
        return res.status(200).json({ success: true, ...data });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const updateSummary: RequestHandler = async (req: AuthRequest, res) => {
    try {
        const resumeId = Number(req.params.resumeId);
        const data = await ResumeService.updateSummaryService(req.user!.userId, resumeId, req.body);
        return res.status(200).json({ success: true, ...data });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

// --- Progress Controller ---
export const getResumeProgress: RequestHandler = async (req: AuthRequest, res: Response) => {
    try {
        const userId = Number(req.user?.userId);
        const resumeId = Number(req.params.resumeId);

        if (!userId || isNaN(userId)) {
            return res.status(401).json({ success: false, message: "Unauthorized or invalid user ID" });
        }

        const progress = await ResumeService.getResumeProgressService(userId, resumeId);
        return res.status(200).json({ success: true, ...progress });
    } catch (error: any) {
        return res.status(400).json({ success: false, message: error.message });
    }
};