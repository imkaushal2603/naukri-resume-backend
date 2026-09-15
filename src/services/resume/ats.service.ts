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
import { checkWithAI } from "../../helpers/ats/ai.check";

export async function getResumeATSService(userId: number, publicId: string): Promise<ATSResumeResult> {
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

    const aiData = await checkWithAI(atsResume);

    const contact = checkContact(atsResume);
    const summary = checkSummary(atsResume);
    const experience = checkExperience(atsResume);
    const education = checkEducation(atsResume);
    const skills = checkSkills(atsResume);
    const structure = checkStructure(atsResume);
    const formatting = checkFormatting(atsResume);

    contact.score = Math.round(contact.score * 0.3 + aiData.contactScore * 0.7);
    contact.rating = getATSRating(contact.score);

    education.score = Math.round(education.score * 0.3 + aiData.educationScore * 0.7);
    education.rating = getATSRating(education.score);

    experience.score = Math.round(experience.score * 0.3 + aiData.experienceScore * 0.7);
    experience.rating = getATSRating(experience.score);

    skills.score = Math.round(skills.score * 0.3 + aiData.skillsScore * 0.7);
    skills.rating = getATSRating(skills.score);

    summary.score = Math.round(summary.score * 0.3 + aiData.summaryScore * 0.7);
    summary.rating = getATSRating(summary.score);

    aiData.contactIssues.forEach((msg) => contact.issues.push({ type: "error", message: msg, field: "contact" }));
    aiData.educationIssues.forEach((msg) => education.issues.push({ type: "error", message: msg, field: "education" }));
    aiData.experienceIssues.forEach((msg) => experience.issues.push({ type: "error", message: msg, field: "experience" }));
    aiData.skillsIssues.forEach((msg) => skills.issues.push({ type: "error", message: msg, field: "skills" }));
    aiData.summaryIssues.forEach((msg) => summary.issues.push({ type: "error", message: msg, field: "summary" }));

    if (aiData.contactScore < 70 && aiData.contactIssues.length === 0) {
        contact.issues.push({
            type: "warning",
            message: "Contact details need improvement. Ensure name, location, and social links are valid.",
            field: "contact",
        });
    }
    if (aiData.summaryScore < 70 && aiData.summaryIssues.length === 0) {
        summary.issues.push({
            type: "warning",
            message: "Summary statement needs more professional depth and relevance to target roles.",
            field: "summary",
        });
    }

    const checks = [contact, summary, experience, education, skills, structure, formatting];

    const totalScore = checks.reduce((total, check) => total + check.score, 0);
    const totalMaxScore = checks.reduce((total, check) => total + check.maxScore, 0);

    let percentage = Math.round((totalScore / totalMaxScore) * 100);

    if (aiData.isFakeResume) {
        percentage = Math.min(percentage, 50);
    }

    const rawIssues = checks.flatMap((check) => check.issues);

    const issues = rawIssues.filter(
        (issue, index, self) =>
            index === self.findIndex((item) => item.message === issue.message && item.field === issue.field)
    );

    return {
        score: totalScore,
        maxScore: totalMaxScore,
        percentage,
        rating: getATSRating(percentage),
        categories: checks,
        issues,
        suggestedSkills: aiData.suggestedSkills,
    };
}