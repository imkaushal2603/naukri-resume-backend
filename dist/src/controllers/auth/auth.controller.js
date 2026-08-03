"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.googleLogin = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const google_helper_1 = require("../../helpers/google.helper");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_service_1 = require("../../services/user.service");
const environment_config_1 = require("../../config/environment.config");
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const register = async (req, res) => {
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
        const existingUser = await (0, user_service_1.findUserByEmail)(email);
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = await (0, user_service_1.createUser)({
            name,
            email,
            password: hashedPassword,
            phone,
        });
        return res.status(201).json({
            message: "User registered successfully",
            user: { id: newUser.id, name: newUser.name, email: newUser.email },
        });
    }
    catch (error) {
        console.error("REGISTER ERROR:", error);
        return res.status(500).json({ message: "Server error", error });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password, keepLoggedIn } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await (0, user_service_1.findUserByEmail)(email);
        if (!user || !user.password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const refreshDays = keepLoggedIn ? 14 : 1;
        const refreshMs = refreshDays * 24 * 60 * 60 * 1000;
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, environment_config_1.JWT_ACCESS_SECRET_KEY, { expiresIn: "1h" });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id }, environment_config_1.JWT_REFRESH_SECRET_KEY, { expiresIn: `${refreshDays}d` });
        const expiresAt = new Date(Date.now() + refreshMs);
        await (0, user_service_1.createSession)({
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
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};
exports.login = login;
const googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).json({ message: "Google ID Token is required" });
        }
        const googlePayload = await (0, google_helper_1.verifyGoogleToken)(idToken);
        const { email, name } = googlePayload;
        if (!email) {
            return res.status(400).json({ message: "Google account must have an email" });
        }
        let user = await (0, user_service_1.findUserByEmail)(email);
        if (!user) {
            user = await (0, user_service_1.createUser)({
                name: name || "Google User",
                email,
                password: "",
            });
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, environment_config_1.JWT_ACCESS_SECRET_KEY, { expiresIn: "1h" });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id }, environment_config_1.JWT_REFRESH_SECRET_KEY, { expiresIn: "14d" });
        const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
        await (0, user_service_1.createSession)({
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
    }
    catch (error) {
        console.error("GOOGLE LOGIN ERROR:", error);
        return res.status(500).json({ message: "Google Authentication failed", error });
    }
};
exports.googleLogin = googleLogin;
const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (refreshToken) {
            await (0, user_service_1.deleteSessionByRefreshToken)(refreshToken);
        }
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
        return res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        console.error("LOGOUT ERROR:", error);
        return res.status(500).json({ message: "Failed to logout", error });
    }
};
exports.logout = logout;
//# sourceMappingURL=auth.controller.js.map