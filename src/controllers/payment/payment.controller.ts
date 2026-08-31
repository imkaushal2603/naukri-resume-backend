import { Request ,Response } from "express";
import { AuthRequest } from "../../types/auth.types";
import { CreatePaymentOrderRequest } from "../../types/payment.types";
import { createPaymentOrderService, getPaymentStatusService, handlePaymentWebhookService } from "../../services/payment/payment.service";

export const createPaymentOrder = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const { planId, returnPath } = req.body as CreatePaymentOrderRequest;

        if (!planId) {
            return res.status(400).json({
                success: false,
                message: "Plan ID is required",
            });
        }

        const result = await createPaymentOrderService(userId, planId, returnPath);

        return res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error("Create payment order error:", error);

        return res.status(500).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to create payment order",
        });
    }
};

export const getPaymentStatus = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { orderId } = req.params;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required",
            });
        }

        const status = await getPaymentStatusService(userId, orderId);

        return res.status(200).json({
            success: true,
            status,
        });

    } catch (error) {
        console.error("Payment status error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get payment status",
        });
    }
};

export const paymentWebhook = async (req: Request, res: Response) => {  
    try {
        
        await handlePaymentWebhookService(req);

        return res.status(200).json({
            success: true,
        });
    } catch (error) {
        console.error("Payment webhook error:", error);

        return res.status(500).json({
            success: false,
            message: "Webhook processing failed",
        });
    }
};