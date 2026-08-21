import { RequestHandler, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyGoogleToken } from "../../helpers/google.helper";
import { AuthRequest } from "../../types/auth.types";
import { findUserByEmail, createUser, createSession, deleteSessionByRefreshToken, findSessionByRefreshToken, findUserById, getMeService, createPasswordResetToken, resetPasswordWithToken } from "../../services/auth/auth.service";
import { JWT_ACCESS_SECRET_KEY, JWT_REFRESH_SECRET_KEY } from "../../config/environment.config";
import { sendResetPasswordEmail } from "../../config/nodemailer.config";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const PHONE_REGEX = /^(?:\+91|0)?[6-9]\d{9}$/;

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: "Name, email, phone and password are required" });
        }

        if (!PHONE_REGEX.test(phone.trim())) {
            return res.status(400).json({
                message: "Please enter a valid 10-digit Indian phone number.",
            });
        }

        if (!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
            });
        }

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await createUser({
            name,
            email,
            password: hashedPassword,
            phone,
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: { id: newUser.id, name: newUser.name, email: newUser.email },
        });
    } catch (error) {
        console.error("REGISTER ERROR:", error);
        return res.status(500).json({ message: "Server error", error });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password, keepLoggedIn } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await findUserByEmail(email);
        if (!user || !user.password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const refreshDays = keepLoggedIn ? 14 : 1;
        const refreshMs = refreshDays * 24 * 60 * 60 * 1000;

        const accessToken = jwt.sign(
            { id: user.id, email: user.email },
            JWT_ACCESS_SECRET_KEY,
            { expiresIn: "1h" }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            JWT_REFRESH_SECRET_KEY,
            { expiresIn: `${refreshDays}d` }
        );

        const expiresAt = new Date(Date.now() + refreshMs);

        await createSession({
            userId: user.id,
            refreshToken,
            expiresAt,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: refreshMs,
        });

        return res.status(200).json({
            message: "Login successful",
            accessToken,
            user: { id: user.id, name: user.name, email: user.email },
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};

export const googleLogin = async (req: Request, res: Response) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ message: "Google ID Token is required" });
        }

        const googlePayload = await verifyGoogleToken(idToken);
        const { email, name } = googlePayload;

        if (!email) {
            return res.status(400).json({ message: "Google account must have an email" });
        }

        let user = await findUserByEmail(email);

        if (!user) {
            user = await createUser({
                name: name || "Google User",
                email,
                password: "",
            });
        }

        const accessToken = jwt.sign(
            { id: user.id, email: user.email },
            JWT_ACCESS_SECRET_KEY,
            { expiresIn: "1h" }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            JWT_REFRESH_SECRET_KEY,
            { expiresIn: "14d" }
        );

        const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

        await createSession({
            userId: user.id,
            refreshToken,
            expiresAt,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 14 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "Google login successful",
            accessToken,
            user: { id: user.id, name: user.name, email: user.email },
        });
    } catch (error) {
        console.error("GOOGLE LOGIN ERROR:", error);
        return res.status(500).json({ message: "Google Authentication failed", error });
    }
};

export const getMe: RequestHandler = async (req: AuthRequest, res: Response) => {
    try {
        const userId = Number(req.user?.userId);

        if (!userId || isNaN(userId)) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid or missing user token",
            });
        }

        const user = await getMeService(userId);

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to retrieve user profile",
        });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const rawToken = await createPasswordResetToken(email);

        if (rawToken) {
            const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
            const resetLink = `${frontendUrl}/reset-password?token=${rawToken}`;
            await sendResetPasswordEmail(email, resetLink);
        }

        return res.status(200).json({
            message: "If an account exists, a reset link has been sent.",
        });
    } catch (error) {
        console.error("FORGOT PASSWORD ERROR:", error);
        return res.status(500).json({ message: "Failed to send reset email" });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and new password are required" });
        }

        if (!PASSWORD_REGEX.test(newPassword)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long and contain at least one uppercase, lowercase letter, and number.",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await resetPasswordWithToken(token, hashedPassword);

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error: any) {
        return res.status(400).json({ message: error.message || "Failed to reset password" });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (refreshToken) {
            await deleteSessionByRefreshToken(refreshToken);
        }

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("LOGOUT ERROR:", error);
        return res.status(500).json({ message: "Failed to logout", error });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const token = req.cookies?.refreshToken;

        if (!token) {
            return res.status(401).json({ message: "No refresh token provided" });
        }

        let decoded: { id: number };
        try {
            decoded = jwt.verify(token, JWT_REFRESH_SECRET_KEY) as { id: number };
        } catch (err) {
            return res.status(401).json({ message: "Invalid or expired refresh token" });
        }

        const session = await findSessionByRefreshToken(token);
        if (!session) {
            return res.status(401).json({ message: "Session not found. Please log in again." });
        }

        if (new Date(session.expiresAt) < new Date()) {
            return res.status(401).json({ message: "Refresh token expired. Please log in again." });
        }

        const user = await findUserById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const newAccessToken = jwt.sign(
            { id: user.id, email: user.email },
            JWT_ACCESS_SECRET_KEY,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Access token refreshed",
            accessToken: newAccessToken,
        });
    } catch (error) {
        console.error("REFRESH TOKEN ERROR:", error);
        return res.status(500).json({ message: "Server error", error });
    }
};