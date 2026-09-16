import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { previewCoverLetter, downloadCoverLetter, getCoverLetterTemplates, getSummarySuggestions } from "../../controllers/coverLetter/coverLetter.controller";

const router = Router();

router.use(authMiddleware);

router.get("/templates", getCoverLetterTemplates);
router.post("/preview", previewCoverLetter);
router.post("/download", downloadCoverLetter);
router.post("/summary-suggestions", getSummarySuggestions);

export default router;