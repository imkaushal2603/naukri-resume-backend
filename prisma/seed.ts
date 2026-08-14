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
    },
    {
        name: "Professional",
        templateKey: "professional",
        preview: "/templates/professional/professional.png",
        status: true,
    },
    {
        name: "Modern",
        templateKey: "modern",
        preview: "/templates/modern/modern.png",
        status: true,
    },
    {
        name: "Minimal",
        templateKey: "minimal",
        preview: "/templates/minimal/minimal.png",
        status: true,
    },
];

async function main() {
    for (const t of templates) {
        await prisma.resume_templates.upsert({
            where: { templateKey: t.templateKey },
            update: {
                name: t.name,
                preview: t.preview,
                status: t.status,
            },
            create: t,
        });
    }
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });