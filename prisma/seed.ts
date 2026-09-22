import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const connectionString =
    process.env.DATABASE_URL ||
    `mysql://${process.env.DATABASE_USER || "root"}:${process.env.DATABASE_PASSWORD || ""
    }@${process.env.DATABASE_HOST || "127.0.0.1"}:${process.env.DATABASE_PORT || 3306
    }/${process.env.DATABASE_NAME || "naukri_resume"}`;

const adapter = new PrismaMariaDb(connectionString);
const prisma = new PrismaClient({ adapter });

const templates = [
    { name: "Classic", templateKey: "classic", preview: "/templates/resumes/classic/classic.png", status: true, tier: "free", categories: ["modern"] },
    { name: "Professional", templateKey: "professional", preview: "/templates/resumes/professional/professional.png", status: true, tier: "paid", categories: ["premium", "with-image"] },
    { name: "Minimal", templateKey: "minimal", preview: "/templates/resumes/minimal/minimal.png", status: true, tier: "free", categories: ["modern"] },
    { name: "Onyx", templateKey: "onyx", preview: "/templates/resumes/onyx/onyx.png", status: true, tier: "paid", categories: ["premium", "with-image"] },
    { name: "Harbor", templateKey: "harbor", preview: "/templates/resumes/harbor/harbor.png", status: true, tier: "paid", categories: ["premium", "with-image", "modern"] },
    { name: "Umber", templateKey: "umber", preview: "/templates/resumes/umber/umber.png", status: true, tier: "paid", categories: ["premium", "with-image", "modern"] },
    { name: "Pulse", templateKey: "pulse", preview: "/templates/resumes/pulse/pulse.png", status: true, tier: "paid", categories: ["premium", "with-image", "modern"] },
];

const membershipPlans = [
    { name: "Weekly", price: 199, durationDays: 7, resumeLimit: 15, status: true },
    { name: "Annual", price: 1195, durationDays: 365, resumeLimit: 15, status: true },
];

const resumeLimitAddons = [
    { name: "Extend to 50 Resumes", price: 299, extraLimit: 35, status: true },
    { name: "Extend to 100 Resumes", price: 599, extraLimit: 85, status: true },
];

const coverLetterTemplates = [
    { name: "Classic", templateKey: "classic", preview: "/templates/cover-letter/classic/classic.png", status: true },
    { name: "Modern", templateKey: "modern", preview: "/templates/cover-letter/modern/modern.png", status: true },
    { name: "Minimal", templateKey: "minimal", preview: "/templates/cover-letter/minimal/minimal.png", status: true },
];

async function main() {
    const validKeys = templates.map((t) => t.templateKey);

    const obsoleteTemplates = await prisma.resume_templates.findMany({
        where: { templateKey: { notIn: validKeys } },
        select: { id: true }
    });

    if (obsoleteTemplates.length > 0) {
        const obsoleteIds = obsoleteTemplates.map(t => t.id);

        const defaultTemplate = await prisma.resume_templates.findUnique({
            where: { templateKey: "classic" }
        });

        if (defaultTemplate) {
            await prisma.resume_builder.updateMany({
                where: { templateId: { in: obsoleteIds } },
                data: { templateId: defaultTemplate.id }
            });
        }

        await prisma.resume_templates.deleteMany({
            where: { id: { in: obsoleteIds } }
        });
    }

    for (const t of templates) {
        await prisma.resume_templates.upsert({
            where: { templateKey: t.templateKey },
            update: { name: t.name, preview: t.preview, status: t.status, tier: t.tier, categories: t.categories },
            create: t,
        });
    }

    for (const plan of membershipPlans) {
        const existingPlan = await prisma.membership_plan.findFirst({ where: { name: plan.name } });
        if (existingPlan) {
            await prisma.membership_plan.update({
                where: { id: existingPlan.id },
                data: { price: plan.price, durationDays: plan.durationDays, status: plan.status },
            });
        } else {
            await prisma.membership_plan.create({ data: plan });
        }
    }

    for (const addon of resumeLimitAddons) {
        const existing = await prisma.resume_limit_addon.findFirst({ where: { name: addon.name } });
        if (existing) {
            await prisma.resume_limit_addon.update({
                where: { id: existing.id },
                data: { price: addon.price, extraLimit: addon.extraLimit, status: addon.status },
            });
        } else {
            await prisma.resume_limit_addon.create({ data: addon });
        }
    }

    for (const t of coverLetterTemplates) {
        await prisma.cover_letter_templates.upsert({
            where: { templateKey: t.templateKey },
            update: { name: t.name, preview: t.preview, status: t.status },
            create: t,
        });
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });