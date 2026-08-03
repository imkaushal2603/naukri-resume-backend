import { PrismaClient } from "../../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
export declare const prisma: PrismaClient<{
    adapter: PrismaMariaDb;
}, never, import("../../generated/prisma/client/runtime/client").DefaultArgs>;
