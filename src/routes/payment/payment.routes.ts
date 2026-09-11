import { Router } from "express";
import { createPaymentOrder, getPaymentStatus, paymentWebhook, getMembershipPlans } from "../../controllers/payment/payment.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
const router = Router();

router.post("/create-order", authMiddleware, createPaymentOrder);
router.get("/status/:orderId", authMiddleware, getPaymentStatus);
router.post("/webhook", paymentWebhook);
router.get("/plans", authMiddleware, getMembershipPlans);

export default router;