import { prisma } from "../../config/database.config";

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