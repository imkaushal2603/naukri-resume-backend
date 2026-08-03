import { prisma } from "../config/database.config";

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

export const deleteSessionByRefreshToken = async (refreshToken: string) => {
  return await prisma.session.deleteMany({
    where: {
      refreshToken,
    },
  });
};