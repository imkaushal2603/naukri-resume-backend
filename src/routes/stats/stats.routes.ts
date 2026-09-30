import { Router } from "express";
import { getResumeStats, getUserStats } from "../../controllers/stats/stats.controller";

const router = Router();

router.get("/resume-count", getResumeStats);
router.get("/user-count", getUserStats);

export default router;