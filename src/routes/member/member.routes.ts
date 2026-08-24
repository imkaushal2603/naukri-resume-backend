import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { getMemberStatus } from "../../controllers/member/member.controller";
const router = Router();

router.get("/", authMiddleware, getMemberStatus);

export default router;