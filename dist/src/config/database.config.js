"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("../../generated/prisma/client");
const adapter_mariadb_1 = require("@prisma/adapter-mariadb");
const connectionString = process.env.DATABASE_URL ||
    `mysql://${process.env.DATABASE_USER || "root"}:${process.env.DATABASE_PASSWORD || ""}@${process.env.DATABASE_HOST || "127.0.0.1"}:${process.env.DATABASE_PORT || 3306}/${process.env.DATABASE_NAME || "naukri_resume"}`;
const adapter = new adapter_mariadb_1.PrismaMariaDb(connectionString);
exports.prisma = new client_1.PrismaClient({ adapter });
//# sourceMappingURL=database.config.js.map