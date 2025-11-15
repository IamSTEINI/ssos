import { PrismaClient } from "@prisma/client";

interface PrismaGlobal {
    __prisma?: PrismaClient;
}

declare global {
    var __prisma: PrismaClient | undefined;
    interface Global extends PrismaGlobal {}
}

const prisma = global.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") global.__prisma = prisma;

export default prisma;