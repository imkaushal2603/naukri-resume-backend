import { prisma } from "../../config/database.config";


export const getMemberStatusService = async (userId: number) => {
    const membership = await prisma.membership.findFirst({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            membership_plan: true,
        },
    });

    if (!membership) {
        throw new Error("Membership not found");
    }

    return {
        status: membership.status,
        membershipPlanId: membership.membershipPlanId,
        plan: membership.membership_plan,
        startDate: membership.startDate,
        endDate: membership.endDate,
    };
};