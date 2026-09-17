import { Router } from "express";
import { uploadSupportAttachment } from "../../middleware/upload.middleware";
import { submitSupportTicket } from "../../controllers/support/support.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.post("/ticket", authMiddleware, uploadSupportAttachment.single("attachment"), submitSupportTicket);

export default router;