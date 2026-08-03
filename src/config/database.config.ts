import { PrismaClient } from "../../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const connectionString =
  process.env.DATABASE_URL ||
  `mysql://${process.env.DATABASE_USER || "root"}:${process.env.DATABASE_PASSWORD || ""
  }@${process.env.DATABASE_HOST || "127.0.0.1"}:${process.env.DATABASE_PORT || 3306
  }/${process.env.DATABASE_NAME || "naukri_resume"}`;

const adapter = new PrismaMariaDb(connectionString);

export const prisma = new PrismaClient({ adapter });