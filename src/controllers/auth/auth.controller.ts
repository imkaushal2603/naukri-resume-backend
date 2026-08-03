import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { verifyGoogleToken } from "../../helpers/google.helper";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser, createSession, deleteSessionByRefreshToken } from "../../services/user.service";
import { JWT_ACCESS_SECRET_KEY, JWT_REFRESH_SECRET_KEY } from "../../config/environment.config";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
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