import { prisma } from "../../config/database.config";
import { renderResumeTemplate } from "../../helpers/templates/renderer.helper";
import puppeteer from "puppeteer";
import HTMLtoDOCX from "html-to-docx";

// 1. Get Templates
export const getTemplatesService = async () => {
    return prisma.resume_templates.findMany({
        where: { status: true },
        orderBy: { id: "asc" },
    });
};

// 2. Get ALL Resumes for a specific user
export const getAllResumesService = async (userId: number) => {
    return prisma.resume_builder.findMany({
        where: { userId },
        include: {
            resume_templates: {
                select: {
                    id: true,
                    name: true,
                    templateKey: true,
                    preview: true,
                },
            },
        },
        orderBy: { updatedAt: "desc" },
    });
};

// 3. Get a Single Resume draft + User profile data
export const getResumeByIdService = async (userId: number, resumeId: number) => {
    const resume = await prisma.resume_builder.findFirst({
        where: { id: resumeId, userId },
        include: {
            resume_templates: true,
        },
    });

    if (!resume) throw new Error("Resume draft not found.");

    const userData = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            summary: true,
            profilePhoto: true,
            city: true,
            state: true,
            country: true,
            linkedin: true,
            github: true,
            user_education: true,
            user_experience: true,
            user_skills: true,
        },
    });

    return {
        ...resume,
        user: userData,
    };
};

// 4. Create a new Resume (allows multiple creations)
const MAX_RESUMES_PER_USER = 15;

export const createResumeBuilderService = async (
    userId: number,
    data: { templateId: number | string; name?: string }
) => {
    const resumeCount = await prisma.resume_builder.count({
        where: { userId },
    });

    if (resumeCount >= MAX_RESUMES_PER_USER) {
        throw new Error(`You can only create up to ${MAX_RESUMES_PER_USER} resumes.`);
    }

    const template = await prisma.resume_templates.findFirst({
        where: {
            id: Number(data.templateId),
            status: true,
        },
    });

    if (!template) {
        throw new Error("Invalid or inactive template selected.");
    }

    return prisma.resume_builder.create({
        data: {
            userId,
            templateId: template.id,
            name: data.name || `My Resume ${resumeCount + 1}`,
        },
    });
};

// 5. Update a specific resume by resumeId
export const updateResumeBuilderService = async (
    userId: number,
    resumeId: number,
    data: { templateId?: number | string; name?: string }
) => {
    const resume = await prisma.resume_builder.findFirst({
        where: { id: resumeId, userId },
    });

    if (!resume) {
        throw new Error("Resume draft not found.");
    }

    const updateData: any = {};
    if (data.name) updateData.name = data.name;

    if (data.templateId) {
        const template = await prisma.resume_templates.findFirst({
            where: {
                id: Number(data.templateId),
                status: true,
            },
        });

        if (!template) {
            throw new Error("Template not found.");
        }

        updateData.templateId = Number(data.templateId);
    }

    return prisma.resume_builder.update({
        where: { id: resumeId },
        data: updateData,
    });
};

// 6. Delete a specific resume by resumeId
export const removeResumeBuilderService = async (userId: number, resumeId: number) => {
    const resume = await prisma.resume_builder.findFirst({
        where: { id: resumeId, userId },
    });

    if (!resume) {
        throw new Error("Resume draft not found.");
    }

    await prisma.resume_builder.delete({
        where: { id: resumeId },
    });

    return { message: "Resume draft deleted successfully." };
};

// 7. Preview a specific resume by resumeId
export const previewResumeService = async (userId: number, resumeId: number) => {
    const resumeData = await getResumeByIdService(userId, resumeId);

    const templateKey = resumeData.resume_templates?.templateKey || "classic";

    const renderData = {
        firstName: resumeData.user?.name?.split(" ")[0] || "",
        lastName: resumeData.user?.name?.split(" ").slice(1).join(" ") || "",
        email: resumeData.user?.email,
        phone: resumeData.user?.phone,
        photoUrl: resumeData.user?.profilePhoto || "",
        city: resumeData.user?.city,
        state: resumeData.user?.state,
        country: resumeData.user?.country,
        linkedin: resumeData.user?.linkedin,
        github: resumeData.user?.github,
        resume_builder: { summary: resumeData.user?.summary },
        candidate_education: (resumeData.user?.user_education || []).map((e: any) => ({
            instituteName: e.school,
            courseDegree: e.degree,
            educationLevel: e.educationLevel,
            startYear: e.startDate ? new Date(e.startDate).getFullYear() : "",
            passingYear: e.endDate ? new Date(e.endDate).getFullYear() : "",
            currentlyStudying: e.isCurrent,
            grade: e.gpa,
        })),
        candidate_experience: (resumeData.user?.user_experience || []).map((e: any) => ({
            companyName: e.company,
            jobTitle: e.role,
            location: e.location,
            employmentType: e.employmentType,
            startMonth: e.startDate ? new Date(e.startDate).toLocaleString("default", { month: "short" }) : "",
            startYear: e.startDate ? new Date(e.startDate).getFullYear() : "",
            endMonth: e.endDate ? new Date(e.endDate).toLocaleString("default", { month: "short" }) : "",
            endYear: e.endDate ? new Date(e.endDate).getFullYear() : "",
            description: e.description,
        })),
        candidate_skills: (resumeData.user?.user_skills || []).map((s: any) => ({
            skillName: s.name,
        })),
    };

    const html = renderResumeTemplate(templateKey, renderData);

    return {
        html,
        resumeName: resumeData.name || "Untitled Resume",
    };
};

// 8. Download a specific resume by resumeId
export const downloadResumeService = async (
    userId: number,
    resumeId: number,
    format: string = "pdf"
) => {
    const { html } = await previewResumeService(userId, resumeId);

    if (format === "docx") {
        const docxBuffer = await HTMLtoDOCX(html, null, {
            table: { row: { cantSplit: true } },
            footer: true,
            pageNumber: true,
        });
        return docxBuffer;
    }

    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "load" });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "0px",
                right: "0px",
                bottom: "0px",
                left: "0px",
            },
        });

        return pdfBuffer;
    } finally {
        await browser.close();
    }
};

// --- Basic Info Services ---
export const getBasicInfoService = async (userId: number) => {
    return prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            profilePhoto: true,
            country: true,
            state: true,
            city: true,
            zipCode: true,
            linkedin: true,
            github: true,
        },
    });
};

export const updateBasicInfoService = async (userId: number, data: any, profilePhotoPath?: string) => {
    const requiredFields = ["name", "phone", "country", "state", "city"];
    const missing = requiredFields.filter((field) => !data[field]?.toString().trim());

    if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(", ")}`);
    }

    return prisma.user.update({
        where: { id: userId },
        data: {
            name: data.name,
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

// --- Education Services ---
export const getEducationList = async (userId: number) => {
    return prisma.user_education.findMany({
        where: { userId },
        orderBy: { startDate: "desc" },
    });
};

export const addEducation = async (userId: number, data: any) => {
    return prisma.user_education.create({
        data: {
            userId,
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

export const updateEducation = async (userId: number, id: number, data: any) => {
    const existing = await prisma.user_education.findFirst({ where: { id, userId } });
    if (!existing) throw new Error("Education record not found");

    return prisma.user_education.update({
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

export const deleteEducation = async (userId: number, id: number) => {
    const existing = await prisma.user_education.findFirst({ where: { id, userId } });
    if (!existing) throw new Error("Education record not found");

    await prisma.user_education.delete({ where: { id } });
    return { message: "Education deleted successfully" };
};

// --- Experience Services ---
export const getExperienceList = async (userId: number) => {
    return prisma.user_experience.findMany({
        where: { userId },
        orderBy: { startDate: "desc" },
    });
};

export const addExperience = async (userId: number, data: any) => {
    return prisma.user_experience.create({
        data: {
            userId,
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

export const updateExperience = async (userId: number, id: number, data: any) => {
    const existing = await prisma.user_experience.findFirst({ where: { id, userId } });
    if (!existing) throw new Error("Experience record not found");

    return prisma.user_experience.update({
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

export const deleteExperience = async (userId: number, id: number) => {
    const existing = await prisma.user_experience.findFirst({ where: { id, userId } });
    if (!existing) throw new Error("Experience record not found");

    await prisma.user_experience.delete({ where: { id } });
    return { message: "Experience deleted successfully" };
};


// Skills
export const getSkillsList = async (userId: number) => {
    return prisma.user_skills.findMany({
        where: { userId },
        orderBy: { id: "asc" },
    });
};

export const addSkill = async (userId: number, name: string, level?: string) => {
    const existing = await prisma.user_skills.findFirst({
        where: { userId, name: { equals: name } },
    });
    if (existing) throw new Error("Skill already added");

    return prisma.user_skills.create({
        data: { userId, name, level },
    });
};

export const deleteSkill = async (userId: number, id: number) => {
    const existing = await prisma.user_skills.findFirst({ where: { id, userId } });
    if (!existing) throw new Error("Skill not found");

    await prisma.user_skills.delete({ where: { id } });
    return { message: "Skill deleted successfully" };
};


// Summary
export const getSummaryService = async (userId: number, resumeId: number) => {
    const resume = await prisma.resume_builder.findFirst({
        where: { id: resumeId, userId },
        select: { name: true },
    });

    if (!resume) throw new Error("Resume draft not found.");

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { summary: true },
    });

    return {
        resumeName: resume.name,
        summary: user?.summary || "",
    };
};

export const updateSummaryService = async (
    userId: number,
    resumeId: number,
    data: { resumeName?: string; summary?: string }
) => {
    await prisma.user.update({
        where: { id: userId },
        data: { summary: data.summary },
    });

    if (data.resumeName !== undefined) {
        const resume = await prisma.resume_builder.findFirst({
            where: { id: resumeId, userId },
        });
        if (resume) {
            await prisma.resume_builder.update({
                where: { id: resumeId },
                data: { name: data.resumeName },
            });
        }
    }

    return getSummaryService(userId, resumeId);
};


// --- Progress Service ---
export const getResumeProgressService = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            name: true,
            phone: true,
            country: true,
            city: true,
            summary: true,
            user_education: { select: { id: true }, take: 1 },
            user_experience: { select: { id: true }, take: 1 },
            user_skills: { select: { id: true }, take: 1 },
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const sections = {
        basicInfo: Boolean(user.name && user.phone && user.country && user.city),
        education: user.user_education.length > 0,
        experience: user.user_experience.length > 0,
        skills: user.user_skills.length > 0,
        summary: Boolean(user.summary && user.summary.trim().length > 10),
    };

    const totalSections = Object.keys(sections).length;
    const completedCount = Object.values(sections).filter(Boolean).length;
    const progressPercentage = Math.round((completedCount / totalSections) * 100);

    return {
        sections,
        completedCount,
        totalSections,
        progressPercentage,
    };
};