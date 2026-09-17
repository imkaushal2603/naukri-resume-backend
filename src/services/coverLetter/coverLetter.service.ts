import { prisma } from "../../config/database.config";
import puppeteer from "puppeteer";
import { CoverLetterData } from "../../types/coverLetter.types";
import { renderCoverLetter } from "../../helpers/templates/coverLetterRenderer.helper";
import { getCoverLetterSummarySuggestions } from "../../helpers/ats/ai.check";

function validateCoverLetterData(data: CoverLetterData) {
    const required: (keyof CoverLetterData)[] = ["fullName", "email", "phone", "jobTitle", "companyName", "summary"];
    const missing = required.filter((field) => !data[field]?.toString().trim());
    if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(", ")}`);
    }
}

async function assertPremium(userId: number) {
    const activeMembership = await prisma.membership.findFirst({
        where: { userId, status: "ACTIVE", endDate: { gt: new Date() } },
    });

    if (!activeMembership) {
        throw new Error("Please upgrade your plan to use the Cover Letter builder.");
    }
}

export async function getCoverLetterTemplatesService() {
    return prisma.cover_letter_templates.findMany({
        where: { status: true },
        orderBy: { id: "asc" },
    });
}

export async function previewCoverLetterService(userId: number, templateKey: string, data: CoverLetterData): Promise<{ html: string }> {
    await assertPremium(userId);
    validateCoverLetterData(data);
    const html = renderCoverLetter(templateKey, data);
    return { html };
}

export async function downloadCoverLetterService(userId: number, templateKey: string, data: CoverLetterData): Promise<Buffer> {
    await assertPremium(userId);
    validateCoverLetterData(data);
    const html = renderCoverLetter(templateKey, data);

    const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "load" });
        const pdf = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
        });
        return Buffer.from(pdf);
    } finally {
        await browser.close();
    }
}

export async function getSummarySuggestionsService(jobTitle: string, companyName?: string, excludeSummaries: string[] = []) {
    if (!jobTitle?.trim()) return { suggestions: [] };
    const suggestions = await getCoverLetterSummarySuggestions(jobTitle, companyName, excludeSummaries);
    return { suggestions };
}