import { prisma } from "../../config/database.config";

import { ATSResume, ATSResumeResult } from "../../types/ats.types";

import { checkContact } from "../../helpers/ats/contact.check";
import { checkSummary } from "../../helpers/ats/summary.check";
import { checkExperience } from "../../helpers/ats/experience.check";
import { checkEducation } from "../../helpers/ats/education.check";
import { checkSkills } from "../../helpers/ats/skills.check";
import { checkStructure } from "../../helpers/ats/structure.check";
import { checkFormatting } from "../../helpers/ats/formatting.check";

import { getATSRating } from "../../helpers/ats.helpers";

export async function getResumeATSService(userId: number, publicId: string): Promise<ATSResumeResult> {

    // const activeMembership = await prisma.membership.findFirst({
    //     where: {
    //         userId,
    //         status: "ACTIVE",
    //         endDate: { gt: new Date() },
    //     },
    // });

    // if (!activeMembership) {
    //     throw new Error("Please upgrade your plan to download resumes.");
    // }

    const resume = await prisma.resume_builder.findFirst({
        where: { publicId, userId },
        include: {
            resume_templates: true,
            resume_education: true,
            resume_experience: true,
            resume_skills: true,
        },
    });

    if (!resume) {
        throw new Error("Resume not found");
    }

    const atsResume = resume as ATSResume;

    const checks = [
        checkContact(atsResume),
        checkSummary(atsResume),
        checkExperience(atsResume),
        checkEducation(atsResume),
        checkSkills(atsResume),
        checkStructure(atsResume),
        checkFormatting(atsResume)
    ];

    const totalScore = checks.reduce(
        (total, check) => total + check.score,
        0
    );

    const totalMaxScore = checks.reduce(
        (total, check) => total + check.maxScore,
        0
    );

    const percentage = Math.round(
        (totalScore / totalMaxScore) * 100
    );

    const issues = checks.flatMap(
        check => check.issues
    );

    return {
        score: totalScore,
        maxScore: totalMaxScore,
        percentage,

        rating: getATSRating(percentage),

        categories: checks,

        issues
    };
}