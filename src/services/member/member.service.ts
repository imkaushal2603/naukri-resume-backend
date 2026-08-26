import { prisma } from "../../config/database.config";


export const getMemberStatusService = async (userId: number) => {
    const membership = await prisma.membership.findFirst({
        where: {
            userId,
            status: "ACTIVE",
            endDate: { gt: new Date() },
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            membership_plan: true,
        },
    });

    if (!membership) {
        return null;
    }

    return {
        status: membership.status,
        membershipPlanId: membership.membershipPlanId,
        plan: membership.membership_plan,
        startDate: membership.startDate,
        endDate: membership.endDate,
        resumeLimit: membership.membership_plan?.resumeLimit ?? 15,
    };
};