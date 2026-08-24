import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth/auth.routes";
import { PORT } from "./config/environment.config";
import resumeRoutes from "./routes/resume/resume.routes";
import paymentRoutes from "./routes/payment/payment.routes";
import memberRoutes from "./routes/member/member.routes";
import path from "path";

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/membership", memberRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "/uploads")));
app.use("/api/templates", express.static(path.join(process.cwd(), "public/templates")));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});