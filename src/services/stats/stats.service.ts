import { prisma } from "../../config/database.config";

export const getResumeStatsService = async () => {
    const totalResumes = await prisma.resume_builder.count();
    return {
        totalResumes: totalResumes + 1000,
    };
};