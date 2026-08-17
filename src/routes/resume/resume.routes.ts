import { Router } from "express";
import { uploadProfilePhoto } from "../../middleware/upload.middleware";
import * as ResumeController from "../../controllers/resume/resume.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.get("/templates", ResumeController.getTemplates);

router.use(authMiddleware);

router.get("/", ResumeController.getAllResumes);
router.post("/builder", ResumeController.createResumeBuilder);
router.get("/builder/:resumeId", ResumeController.getResumeById);
router.put("/builder/:resumeId", ResumeController.updateResumeBuilder);
router.delete("/builder/:resumeId", ResumeController.removeResumeBuilder);
router.get("/builder/:resumeId/preview", ResumeController.previewResume);
router.get("/builder/:resumeId/download", ResumeController.downloadResumeController);

router.get("/builder/:resumeId/basic-info", ResumeController.getBasicInfo);
router.put("/builder/:resumeId/basic-info", uploadProfilePhoto.single("profilePhoto"), ResumeController.updateBasicInfo);

router.get("/builder/:resumeId/education", ResumeController.getEducation);
router.post("/builder/:resumeId/education", ResumeController.addEducation);
router.put("/builder/:resumeId/education/:id", ResumeController.updateEducation);
router.delete("/builder/:resumeId/education/:id", ResumeController.deleteEducation);

router.get("/builder/:resumeId/experience", ResumeController.getExperience);
router.post("/builder/:resumeId/experience", ResumeController.addExperience);
router.put("/builder/:resumeId/experience/:id", ResumeController.updateExperience);
router.delete("/builder/:resumeId/experience/:id", ResumeController.deleteExperience);

router.get("/builder/:resumeId/skills", ResumeController.getSkills);
router.post("/builder/:resumeId/skills", ResumeController.addSkill);
router.delete("/builder/:resumeId/skills/:id", ResumeController.deleteSkill);

router.get("/builder/:resumeId/summary", ResumeController.getSummary);
router.put("/builder/:resumeId/summary", ResumeController.updateSummary);

router.get("/builder/:resumeId/progress", ResumeController.getResumeProgress);

export default router;