import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { previewCoverLetter, downloadCoverLetter, getCoverLetterTemplates, getSummarySuggestions } from "../../controllers/coverLetter/coverLetter.controller";
import { uploadProfilePhoto } from "../../middleware/upload.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/templates", getCoverLetterTemplates);
router.post("/preview", previewCoverLetter);
router.post("/download", downloadCoverLetter);
router.post("/summary-suggestions", getSummarySuggestions);
router.post("/photo", authMiddleware, uploadProfilePhoto.single("photo"), (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded." });
    return res.status(200).json({ success: true, photoUrl: `/uploads/${req.file.filename}` });
});

export default router;