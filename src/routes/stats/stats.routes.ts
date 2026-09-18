import { Router } from "express";
import { getResumeStats } from "../../controllers/stats/stats.controller";

const router = Router();

router.get("/resume-count", getResumeStats);

export default router;