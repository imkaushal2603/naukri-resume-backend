import { prisma } from "../../config/database.config";
import { renderResumeTemplate } from "../../helpers/templates/renderer.helper";
import puppeteer from "puppeteer";
import HTMLtoDOCX from "html-to-docx";
import path from "path";
import fs from "fs";

const PREVIEW_DIR = path.join(process.cwd(), "uploads", "previews");

// 1. Get Templates
export const getTemplatesService = async () => {
    return prisma.resume_templates.findMany({
        where: { status: true },
        orderBy: { id: "asc" },
    });
};

// 2. Get ALL Resumes for a specific user
export const getAllResumesService = async (userId: number) => {
    const [resumes, maxResumes] = await Promise.all([
        prisma.resume_builder.findMany({
            where: { userId },
            include: {
                resume_templates: {
                    select: { id: true, name: true, templateKey: true, preview: true },
                },
                resume_education: { select: { id: true }, take: 1 },
                resume_experience: { select: { id: true }, take: 1 },
                resume_skills: { select: { id: true }, take: 1 },
            },
            orderBy: { updatedAt: "desc" },
        }),
        getActiveUserResumeLimit(userId),
    ]);

    const formattedResumes = resumes.map((resume) => {
        const sections = {
            basicInfo: Boolean(resume.fullName && resume.phone && resume.country && resume.city),
            education: resume.resume_education.length > 0,
            experience: resume.resume_experience.length > 0,
            skills: resume.resume_skills.length > 0,
            summary: Boolean(resume.summary && resume.summary.trim().length > 10),
        };

        const totalSections = Object.keys(sections).length;
        const completedCount = Object.values(sections).filter(Boolean).length;
        const progressPercentage = Math.round((completedCount / totalSections) * 100);

        const { resume_education, resume_experience, resume_skills, ...rest } = resume;

        return {
            ...rest,
            progressPercentage,
            isDraft: progressPercentage < 100,
        };
    });

    return {
        resumes: formattedResumes,
        maxResumes,
    };
};

// 3. Get a Single Resume draft — now self-contained, no separate user lookup needed
export const getResumeByIdService = async (userId: number, resumeId: number) => {
    const resume = await prisma.resume_builder.findFirst({
        where: { id: resumeId, userId },
        include: {
            resume_templates: true,
            resume_education: true,
            resume_experience: true,
            resume_skills: true,
        },
    });

    if (!resume) throw new Error("Resume draft not found.");

    return resume;
};

// 4. Create a new Resume — seed with account defaults from user
export const createResumeBuilderService = async (
    userId: number,
    data: { templateId: number | string; name?: string }
) => {
    const resumeCount = await prisma.resume_builder.count({ where: { userId } });
    const maxResumes = await getActiveUserResumeLimit(userId);

    if (resumeCount >= maxResumes) {
        throw new Error(`You have reached your limit of ${maxResumes} resumes.`);
    }

    let templateIdToUse = data.templateId ? Number(data.templateId) : null;
    if (!templateIdToUse) {
        const defaultTemplate = await prisma.resume_templates.findFirst({
            where: { status: true },
            orderBy: { id: "asc" },
        });
        if (!defaultTemplate) throw new Error("No active resume templates found.");
        templateIdToUse = defaultTemplate.id;
    }

    const account = await prisma.user.findUnique({ where: { id: userId } });

    return prisma.resume_builder.create({
        data: {
            userId,
            templateId: templateIdToUse,
            name: data.name || `My Resume ${resumeCount + 1}`,
            fullName: account?.name || "",
            email: account?.email || "",
            phone: account?.phone || "",
        },
    });
};

// 5. Update a specific resume (template/name)
export const updateResumeBuilderService = async (
    userId: number,
    resumeId: number,
    data: { templateId?: number | string; name?: string }
) => {
    const resume = await prisma.resume_builder.findFirst({ where: { id: resumeId, userId } });
    if (!resume) throw new Error("Resume draft not found.");

    const updateData: any = {};
    if (data.name) updateData.name = data.name;

    if (data.templateId) {
        const template = await prisma.resume_templates.findFirst({
            where: { id: Number(data.templateId), status: true },
        });
        if (!template) throw new Error("Template not found.");
        updateData.templateId = Number(data.templateId);
    }

    return prisma.resume_builder.update({ where: { id: resumeId }, data: updateData });
};

// 6. Delete a specific resume — cascades automatically now
export const removeResumeBuilderService = async (userId: number, resumeId: number) => {
    const resume = await prisma.resume_builder.findFirst({ where: { id: resumeId, userId } });
    if (!resume) throw new Error("Resume draft not found.");

    await prisma.resume_builder.delete({ where: { id: resumeId } });
    return { message: "Resume draft deleted successfully." };
};

// 7. Preview
export const previewResumeService = async (userId: number, resumeId: number) => {
    const resume = await getResumeByIdService(userId, resumeId);
    const templateKey = resume.resume_templates?.templateKey || "classic";

    const renderData = {
        firstName: resume.fullName?.split(" ")[0] || "",
        lastName: resume.fullName?.split(" ").slice(1).join(" ") || "",
        email: resume.email,
        phone: resume.phone,
        photoUrl: resume.profilePhoto || "",
        city: resume.city,
        state: resume.state,
        country: resume.country,
        linkedin: resume.linkedin,
        github: resume.github,
        resume_builder: { summary: resume.summary },
        candidate_education: (resume.resume_education || []).map((e: any) => ({
            instituteName: e.school,
            courseDegree: e.degree,
            educationLevel: e.educationLevel,
            startYear: e.startDate ? String(new Date(e.startDate).getFullYear()) : "",
            passingYear: e.endDate ? String(new Date(e.endDate).getFullYear()) : "",
            currentlyStudying: e.isCurrent,
            grade: e.gpa,
        })),
        candidate_experience: (resume.resume_experience || []).map((e: any) => ({
            companyName: e.company,
            jobTitle: e.role,
            location: e.location,
            employmentType: e.employmentType,
            startMonth: e.startDate ? new Date(e.startDate).toLocaleString("default", { month: "short" }) : "",
            startYear: e.startDate ? String(new Date(e.startDate).getFullYear()) : "",
            endMonth: e.endDate ? new Date(e.endDate).toLocaleString("default", { month: "short" }) : "",
            endYear: e.endDate ? String(new Date(e.endDate).getFullYear()) : "",
            description: e.description,
            currentlyWorking: e.isCurrent,
        })),
        candidate_skills: (resume.resume_skills || []).map((s: any) => ({ skillName: s.name })),
    };

    const html = renderResumeTemplate(templateKey, renderData);
    return { html, resumeName: resume.name || "Untitled Resume" };
};

// 8. Download
export const downloadResumeService = async (userId: number, resumeId: number, format: string = "pdf") => {
    const activeMembership = await prisma.membership.findFirst({
        where: {
            userId,
            status: "ACTIVE",
            endDate: { gt: new Date() },
        },
    });

    if (!activeMembership) {
        throw new Error("Please upgrade your plan to download resumes.");
    }

    const { html } = await previewResumeService(userId, resumeId);

    if (format === "docx") {
        return HTMLtoDOCX(html, null, { table: { row: { cantSplit: true } }, footer: true, pageNumber: true });
    }

    const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "load" });
        return await page.pdf({
            format: "A4",
            printBackground: true,
            margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
        });
    } finally {
        await browser.close();
    }
};

export const generateResumeThumbnailService = async (userId: number, resumeId: number) => {
    const { html } = await previewResumeService(userId, resumeId);

    if (!fs.existsSync(PREVIEW_DIR)) {
        fs.mkdirSync(PREVIEW_DIR, { recursive: true });
    }

    const fileName = `resume-${resumeId}-${Date.now()}.jpg`;
    const filePath = path.join(PREVIEW_DIR, fileName);

    const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 397, height: 562, deviceScaleFactor: 1 });
        await page.setContent(html, { waitUntil: "load" });
        await page.evaluateHandle('document.fonts.ready');
        await page.screenshot({ path: filePath, type: "jpeg", quality: 70, fullPage: true });
    } finally {
        await browser.close();
    }

    const publicPath = `/uploads/previews/${fileName}`;

    const existing = await prisma.resume_builder.findUnique({
        where: { id: resumeId },
        select: { previewImage: true },
    });
    if (existing?.previewImage) {
        const oldFilePath = path.join(process.cwd(), existing.previewImage);
        if (fs.existsSync(oldFilePath)) {
            fs.unlink(oldFilePath, () => { });
        }
    }

    await prisma.resume_builder.update({
        where: { id: resumeId },
        data: { previewImage: publicPath },
    });

    return publicPath;
};

// --- Basic Info ---
export const getBasicInfoService = async (userId: number, resumeId: number) => {
    if (!resumeId || Number.isNaN(resumeId)) throw new Error("Invalid resume ID.");
    const resume = await prisma.resume_builder.findFirst({
        where: { id: resumeId, userId },
        select: {
            id: true, fullName: true, email: true, phone: true, profilePhoto: true,
            country: true, state: true, city: true, zipCode: true, linkedin: true, github: true,
        },
    });
    if (!resume) throw new Error("Resume draft not found.");
    return resume;
};

export const updateBasicInfoService = async (
    userId: number,
    resumeId: number,
    data: any,
    profilePhotoPath?: string
) => {
    const requiredFields = ["fullName", "phone", "country", "state", "city"];
    const missing = requiredFields.filter((f) => !data[f]?.toString().trim());
    if (missing.length > 0) throw new Error(`Missing required fields: ${missing.join(", ")}`);

    const resume = await prisma.resume_builder.findFirst({ where: { id: resumeId, userId } });
    if (!resume) throw new Error("Resume draft not found.");

    return prisma.resume_builder.update({
        where: { id: resumeId },
        data: {
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            country: data.country,
            state: data.state,
            city: data.city,
            zipCode: data.zipCode,
            linkedin: data.linkedin,
            github: data.github,
            ...(profilePhotoPath && { profilePhoto: profilePhotoPath }),
        },
    });
};

// --- Education — scoped to resumeId ---
export const getEducationList = async (userId: number, resumeId: number) => {
    await assertResumeOwnership(userId, resumeId);
    return prisma.resume_education.findMany({ where: { resumeId }, orderBy: { startDate: "desc" } });
};

export const addEducation = async (userId: number, resumeId: number, data: any) => {
    await assertResumeOwnership(userId, resumeId);
    return prisma.resume_education.create({
        data: {
            resumeId,
            school: data.school,
            degree: data.degree,
            educationLevel: data.educationLevel,
            startDate: data.startDate ? new Date(data.startDate) : null,
            endDate: data.endDate ? new Date(data.endDate) : null,
            isCurrent: !!data.isCurrent,
            gpa: data.gpa,
        },
    });
};

export const updateEducation = async (userId: number, resumeId: number, id: number, data: any) => {
    await assertResumeOwnership(userId, resumeId);
    const existing = await prisma.resume_education.findFirst({ where: { id, resumeId } });
    if (!existing) throw new Error("Education record not found");

    return prisma.resume_education.update({
        where: { id },
        data: {
            school: data.school,
            degree: data.degree,
            educationLevel: data.educationLevel,
            startDate: data.startDate ? new Date(data.startDate) : null,
            endDate: data.endDate ? new Date(data.endDate) : null,
            isCurrent: !!data.isCurrent,
            gpa: data.gpa,
        },
    });
};

export const deleteEducation = async (userId: number, resumeId: number, id: number) => {
    await assertResumeOwnership(userId, resumeId);
    const existing = await prisma.resume_education.findFirst({ where: { id, resumeId } });
    if (!existing) throw new Error("Education record not found");

    await prisma.resume_education.delete({ where: { id } });
    return { message: "Education deleted successfully" };
};

// --- Experience ---
export const getExperienceList = async (userId: number, resumeId: number) => {
    await assertResumeOwnership(userId, resumeId);
    return prisma.resume_experience.findMany({ where: { resumeId }, orderBy: { startDate: "desc" } });
};

export const addExperience = async (userId: number, resumeId: number, data: any) => {
    await assertResumeOwnership(userId, resumeId);
    return prisma.resume_experience.create({
        data: {
            resumeId,
            company: data.company,
            role: data.role,
            location: data.location,
            employmentType: data.employmentType,
            startDate: data.startDate ? new Date(data.startDate) : null,
            endDate: data.endDate ? new Date(data.endDate) : null,
            isCurrent: !!data.isCurrent,
            description: data.description,
        },
    });
};

export const updateExperience = async (userId: number, resumeId: number, id: number, data: any) => {
    await assertResumeOwnership(userId, resumeId);
    const existing = await prisma.resume_experience.findFirst({ where: { id, resumeId } });
    if (!existing) throw new Error("Experience record not found");

    return prisma.resume_experience.update({
        where: { id },
        data: {
            company: data.company,
            role: data.role,
            location: data.location,
            employmentType: data.employmentType,
            startDate: data.startDate ? new Date(data.startDate) : null,
            endDate: data.endDate ? new Date(data.endDate) : null,
            isCurrent: !!data.isCurrent,
            description: data.description,
        },
    });
};

export const deleteExperience = async (userId: number, resumeId: number, id: number) => {
    await assertResumeOwnership(userId, resumeId);
    const existing = await prisma.resume_experience.findFirst({ where: { id, resumeId } });
    if (!existing) throw new Error("Experience record not found");

    await prisma.resume_experience.delete({ where: { id } });
    return { message: "Experience deleted successfully" };
};

// --- Skills ---
export const getSkillsList = async (userId: number, resumeId: number) => {
    await assertResumeOwnership(userId, resumeId);
    return prisma.resume_skills.findMany({ where: { resumeId }, orderBy: { id: "asc" } });
};

export const addSkill = async (userId: number, resumeId: number, name: string, level?: string) => {
    await assertResumeOwnership(userId, resumeId);
    const existing = await prisma.resume_skills.findFirst({ where: { resumeId, name: { equals: name } } });
    if (existing) throw new Error("Skill already added");

    return prisma.resume_skills.create({ data: { resumeId, name, level } });
};

export const deleteSkill = async (userId: number, resumeId: number, id: number) => {
    await assertResumeOwnership(userId, resumeId);
    const existing = await prisma.resume_skills.findFirst({ where: { id, resumeId } });
    if (!existing) throw new Error("Skill not found");

    await prisma.resume_skills.delete({ where: { id } });
    return { message: "Skill deleted successfully" };
};

// --- Summary ---
export const getSummaryService = async (userId: number, resumeId: number) => {
    const resume = await prisma.resume_builder.findFirst({
        where: { id: resumeId, userId },
        select: { name: true, summary: true },
    });
    if (!resume) throw new Error("Resume draft not found.");

    return { resumeName: resume.name, summary: resume.summary || "" };
};

export const updateSummaryService = async (
    userId: number,
    resumeId: number,
    data: { resumeName?: string; summary?: string }
) => {
    await assertResumeOwnership(userId, resumeId);

    return prisma.resume_builder.update({
        where: { id: resumeId },
        data: {
            summary: data.summary,
            ...(data.resumeName !== undefined && { name: data.resumeName }),
        },
    }).then(() => getSummaryService(userId, resumeId));
};

// --- Progress ---
export const getResumeProgressService = async (userId: number, resumeId: number) => {
    const resume = await prisma.resume_builder.findFirst({
        where: { id: resumeId, userId },
        select: {
            fullName: true, phone: true, country: true, city: true, summary: true,
            resume_education: { select: { id: true }, take: 1 },
            resume_experience: { select: { id: true }, take: 1 },
            resume_skills: { select: { id: true }, take: 1 },
        },
    });

    if (!resume) throw new Error("Resume draft not found.");

    const sections = {
        basicInfo: Boolean(resume.fullName && resume.phone && resume.country && resume.city),
        education: resume.resume_education.length > 0,
        experience: resume.resume_experience.length > 0,
        skills: resume.resume_skills.length > 0,
        summary: Boolean(resume.summary && resume.summary.trim().length > 10),
    };

    const totalSections = Object.keys(sections).length;
    const completedCount = Object.values(sections).filter(Boolean).length;
    const progressPercentage = Math.round((completedCount / totalSections) * 100);

    return { sections, completedCount, totalSections, progressPercentage };
};

// Helper — confirm the resume belongs to this user before touching child records
async function assertResumeOwnership(userId: number, resumeId: number) {
    const resume = await prisma.resume_builder.findFirst({ where: { id: resumeId, userId } });
    if (!resume) throw new Error("Resume draft not found or access denied.");
}

export const getActiveUserResumeLimit = async (userId: number): Promise<number> => {
    const activeMembership = await prisma.membership.findFirst({
        where: {
            userId,
            status: "ACTIVE",
            endDate: { gt: new Date() },
        },
        include: {
            membership_plan: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return activeMembership?.membership_plan?.resumeLimit ?? 15;
};