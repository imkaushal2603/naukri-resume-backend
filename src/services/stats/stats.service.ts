import { prisma } from "../../config/database.config";

export const getResumeStatsService = async () => {
    const totalResumes = await prisma.resume_builder.count();
    return {
        totalResumes: totalResumes + 1000,
    };
};

export const getUserStatsService = async () => {
    const totalUsers = await prisma.user.count();
    return {
        totalUsers: totalUsers + 50,
    };
};