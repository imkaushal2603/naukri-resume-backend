import { Router } from "express";
import { uploadProfilePhoto } from "../../middleware/upload.middleware";
import * as ResumeController from "../../controllers/resume/resume.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

// Public Routes
router.get("/templates", ResumeController.getTemplates);

// Authenticated Routes
router.use(authMiddleware);

// Resume Builder Routes
router.get("/", ResumeController.getAllResumes);
router.post("/builder", ResumeController.createResumeBuilder);
router.get("/builder/:resumeId", ResumeController.getResumeById);
router.put("/builder/:resumeId", ResumeController.updateResumeBuilder);
router.delete("/builder/:resumeId", ResumeController.removeResumeBuilder);
router.get("/builder/:resumeId/preview", ResumeController.previewResume);
router.get("/builder/:resumeId/download", ResumeController.downloadResumeController);

// Basic Info
router.get("/basic-info", ResumeController.getBasicInfo);
router.put("/basic-info", uploadProfilePhoto.single("profilePhoto"), ResumeController.updateBasicInfo);

// Education
router.get("/education", ResumeController.getEducation);
router.post("/education", ResumeController.addEducation);
router.put("/education/:id", ResumeController.updateEducation);
router.delete("/education/:id", ResumeController.deleteEducation);

// Experience
router.get("/experience", ResumeController.getExperience);
router.post("/experience", ResumeController.addExperience);
router.put("/experience/:id", ResumeController.updateExperience);
router.delete("/experience/:id", ResumeController.deleteExperience);

// Skills
router.get("/skills", ResumeController.getSkills);
router.post("/skills", ResumeController.addSkill);
router.delete("/skills/:id", ResumeController.deleteSkill);

// Summary
router.get("/builder/:resumeId/summary", ResumeController.getSummary);
router.put("/builder/:resumeId/summary", ResumeController.updateSummary);

// Progress
router.get("/progress", ResumeController.getResumeProgress);

export default router;