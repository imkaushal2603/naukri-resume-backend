import { prisma } from "../../config/database.config";
import { createCashfreeOrder } from "./cashfree.service";

export const createPaymentOrderService = async (
    userId: number,
    params: { planId?: number; addonId?: number; returnPath?: string }
) => {
    const { planId, addonId, returnPath } = params;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");
    if (!user.phone) throw new Error("Please add your phone number before making payment");

    if (addonId) {
        const addon = await prisma.resume_limit_addon.findUnique({ where: { id: addonId } });
        if (!addon || !addon.status) throw new Error("Resume limit add-on not found");

        if (user.extraResumeLimit >= addon.extraLimit) {
            throw new Error("You already have this resume limit or higher.");
        }

        const orderId = `order_${Date.now()}_${userId}`;

        await prisma.payment.create({
            data: {
                userId: user.id,
                resumeLimitAddonId: addon.id,
                type: "RESUME_LIMIT_ADDON",
                orderId,
                amount: addon.price,
                status: "PENDING",
            },
        });

        const cashfreeOrder = await createCashfreeOrder({
            orderId,
            amount: Number(addon.price),
            customerId: String(user.id),
            customerName: user.name,
            customerEmail: user.email,
            customerPhone: user.phone,
            returnPath: returnPath || "/extend-resume-limit",
        });

        return {
            orderId: cashfreeOrder.order_id,
            paymentSessionId: cashfreeOrder.payment_session_id,
        };
    }

    if (!planId) throw new Error("Plan ID or Add-on ID is required");

    const plan = await prisma.membership_plan.findUnique({ where: { id: planId } });
    if (!plan || !plan.status) throw new Error("Membership plan not found");

    const orderId = `order_${Date.now()}_${userId}`;

    await prisma.payment.create({
        data: {
            userId: user.id,
            membershipPlanId: plan.id,
            type: "MEMBERSHIP",
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
        returnPath: returnPath || "/dashboard",
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

    if (!payment.membership_plan || !payment.membershipPlanId) {
        throw new Error("This payment is not a membership plan purchase");
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

const activateResumeLimitAddonService = async (paymentId: number) => {
    const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: { resume_limit_addon: true },
    });

    if (!payment || payment.status !== "SUCCESS" || !payment.resume_limit_addon) {
        throw new Error("Payment not successful");
    }

    const user = await prisma.user.findUnique({
        where: { id: payment.userId },
        select: { extraResumeLimit: true },
    });

    const newExtraLimit = Math.max(
        user?.extraResumeLimit ?? 0,
        payment.resume_limit_addon.extraLimit
    );

    return prisma.user.update({
        where: { id: payment.userId },
        data: { extraResumeLimit: newExtraLimit },
    });
};

export const handlePaymentWebhookService = async (req: any) => {
    const orderId = req.body?.data?.order?.order_id;
    const paymentStatus = req.body?.data?.payment?.payment_status;

    if (!orderId) throw new Error("Order ID missing");
    if (paymentStatus !== "SUCCESS") return;

    const payment = await prisma.payment.findUnique({ where: { orderId } });
    if (!payment) throw new Error("Payment not found");
    if (payment.status === "SUCCESS") return;

    const updatedPayment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
            status: "SUCCESS",
            cashfreePaymentId: req.body?.data?.payment?.cf_payment_id?.toString(),
            paymentMethod: req.body?.data?.payment?.payment_group,
        },
    });

    if (updatedPayment.type === "RESUME_LIMIT_ADDON") {
        await activateResumeLimitAddonService(updatedPayment.id);
    } else {
        await activateMembershipService(updatedPayment.id);
    }
};

export const getMembershipPlansService = async (userId: number) => {
    const [plans, activeMembership] = await Promise.all([
        prisma.membership_plan.findMany({
            where: { status: true },
            orderBy: { durationDays: "asc" },
        }),
        prisma.membership.findFirst({
            where: { userId, status: "ACTIVE", endDate: { gt: new Date() } },
            include: { membership_plan: true },
            orderBy: { createdAt: "desc" },
        }),
    ]);

    const currentDuration = activeMembership?.membership_plan?.durationDays ?? 0;
    const currentPlanId = activeMembership?.membershipPlanId ?? null;

    return plans.map((plan) => ({
        ...plan,
        status:
            currentPlanId === plan.id
                ? "current"
                : currentDuration > plan.durationDays
                ? "included"
                : "available",
    }));
};