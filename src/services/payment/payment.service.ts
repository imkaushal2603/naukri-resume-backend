import { prisma } from "../../config/database.config";
import { createCashfreeOrder } from "./cashfree.service";

export const createPaymentOrderService = async (userId: number, planId: number) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (!user.phone) {
        throw new Error(
            "Please add your phone number before making payment"
        );
    }

    const plan = await prisma.membership_plan.findUnique({
        where: {
            id: planId,
        },
    });

    if (!plan || !plan.status) {
        throw new Error("Membership plan not found");
    }

    const orderId = `order_${Date.now()}_${userId}`;

    await prisma.payment.create({
        data: {
            userId: user.id,
            membershipPlanId: plan.id,
            orderId,
            amount: plan.price,
            status: "PENDING",
        },
    });

    const cashfreeOrder = await createCashfreeOrder({
        orderId,
        amount: Number(plan.price),
        customerId: String(user.id),
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone,
    });

    return {
        orderId: cashfreeOrder.order_id,
        paymentSessionId: cashfreeOrder.payment_session_id,
    };
};

export const getPaymentStatusService = async (userId: number, orderId: any) => {

    const payment = await prisma.payment.findFirst({
        where: {
            userId,
            orderId,
        },
    });

    if (!payment) {
        throw new Error("Payment not found");
    }

    return payment.status;
};
const activateMembershipService = async (paymentId: number) => {
    const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: { membership_plan: true },
    });

    if (!payment || payment.status !== "SUCCESS") {
        throw new Error("Payment not successful");
    }

    const existing = await prisma.membership.findUnique({
        where: { paymentId },
    });

    if (existing) return existing;

    const startDate = new Date();
    const endDate = new Date(startDate);

    endDate.setDate(
        endDate.getDate() + payment.membership_plan.durationDays
    );

    return prisma.membership.create({
        data: {
            userId: payment.userId,
            membershipPlanId: payment.membershipPlanId,
            paymentId: payment.id,
            status: "ACTIVE",
            startDate,
            endDate,
        },
    });
};
export const handlePaymentWebhookService = async (req: any) => {
    const orderId = req.body?.data?.order?.order_id;

    const paymentStatus = req.body?.data?.payment?.payment_status;

    if (!orderId) {
        throw new Error("Order ID missing");
    }

    if (paymentStatus !== "SUCCESS") {
        return;
    }

    const payment = await prisma.payment.findUnique({
        where: {
            orderId,
        },
    });

    if (!payment) {
        throw new Error("Payment not found");
    }

    if (payment.status === "SUCCESS") {
        return;
    }

    const updatedPayment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
            status: "SUCCESS",
            cashfreePaymentId: req.body?.data?.payment?.cf_payment_id?.toString(),
            paymentMethod: req.body?.data?.payment?.payment_group,
        },
    });
    await activateMembershipService(updatedPayment.id);
};