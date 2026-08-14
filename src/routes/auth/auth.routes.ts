import { Router } from "express";
import { register, login, googleLogin, logout, refreshToken, getMe } from "../../controllers/auth/auth.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.get("/me", authMiddleware, getMe);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

export default router;