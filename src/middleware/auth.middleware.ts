import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET_KEY } from "../config/environment.config";
import { AuthRequest } from "../types/auth.types";

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, JWT_ACCESS_SECRET_KEY) as {
            id: number;
            email: string;
        };

        req.user = {
            userId: decoded.id,
            email: decoded.email,
        };

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};