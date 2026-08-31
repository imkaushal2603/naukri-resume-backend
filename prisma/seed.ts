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
    {
        name: "Classic",
        templateKey: "classic",
        preview: "/templates/classic/classic.png",
        status: true,
        tier: "free",
        categories: ["modern"],
    },
    {
        name: "Professional",
        templateKey: "professional",
        preview: "/templates/professional/professional.png",
        status: true,
        tier: "paid",
        categories: ["premium", "with-image"],
    },
    {
        name: "Modern",
        templateKey: "modern",
        preview: "/templates/modern/modern.png",
        status: true,
        tier: "paid",
        categories: ["premium", "modern"],
    },
    {
        name: "Minimal",
        templateKey: "minimal",
        preview: "/templates/minimal/minimal.png",
        status: true,
        tier: "free",
        categories: ["modern"],
    },
];

const membershipPlans = [
    {
        name: "Weekly",
        price: 199,
        durationDays: 7,
        resumeLimit: 15,
        status: true,
    },
    {
        name: "Annual",
        price: 1195,
        durationDays: 365,
        resumeLimit: 15,
        status: true,
    },
];

async function main() {
    for (const t of templates) {
        await prisma.resume_templates.upsert({
            where: {
                templateKey: t.templateKey,
            },
            update: {
                name: t.name,
                preview: t.preview,
                status: t.status,
                tier: t.tier,
                categories: t.categories,
            },
            create: t,
        });
    }

    for (const plan of membershipPlans) {
        const existingPlan = await prisma.membership_plan.findFirst({
            where: {
                name: plan.name,
            },
        });

        if (existingPlan) {
            await prisma.membership_plan.update({
                where: {
                    id: existingPlan.id,
                },
                data: {
                    price: plan.price,
                    durationDays: plan.durationDays,
                    status: plan.status,
                },
            });
        } else {
            await prisma.membership_plan.create({
                data: plan,
            });
        }
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