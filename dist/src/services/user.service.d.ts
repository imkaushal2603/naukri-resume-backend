export declare const findUserByEmail: (email: string) => Promise<{
    id: number;
    name: string;
    email: string;
    password: string | null;
    phone: string | null;
    googleId: string | null;
    createdAt: Date;
    updatedAt: Date;
} | null>;
export declare const createUser: (data: {
    name: string;
    email: string;
    password?: string;
    phone?: string;
}) => Promise<{
    id: number;
    name: string;
    email: string;
    password: string | null;
    phone: string | null;
    googleId: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const createSession: (data: {
    userId: number;
    refreshToken: string;
    expiresAt: Date;
}) => Promise<{
    id: number;
    userId: number;
    refreshToken: string;
    expiresAt: Date;
    createdAt: Date;
}>;
export declare const deleteSessionByRefreshToken: (refreshToken: string) => Promise<import("../../generated/prisma/client").Prisma.BatchPayload>;
