import { prisma } from "../../config/database.config";
import crypto from "crypto";

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const createUser = async (data: {
  name: string;
  email: string;
  password?: string;
  phone?: string;
}) => {
  return await prisma.user.create({
    data,
  });
};

export const createSession = async (data: {
  userId: number;
  refreshToken: string;
  expiresAt: Date;
}) => {
  return await prisma.session.create({
    data,
  });
};

export const getMeService = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// Store token hash & 15-min expiration date in the DB
export const createPasswordResetToken = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: expiresAt,
    },
  });

  return rawToken;
};

// Verify raw token against stored hash, update password, and clear token
export const resetPasswordWithToken = async (rawToken: string, passwordHash: string) => {
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { gt: new Date() },
    },
  });

  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  return await prisma.user.update({
    where: { id: user.id },
    data: {
      password: passwordHash,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    },
  });
};

export const deleteSessionByRefreshToken = async (refreshToken: string) => {
  return await prisma.session.deleteMany({
    where: {
      refreshToken,
    },
  });
};

export const findSessionByRefreshToken = async (refreshToken: string) => {
  return await prisma.session.findFirst({
    where: { refreshToken },
  });
};

export const findUserById = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};