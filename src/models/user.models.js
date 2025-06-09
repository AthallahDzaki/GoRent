import prisma from "../lib/prisma.js";

export const findAll = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    },
  });
}

export const findById = async (id) => {
  return await prisma.user.findUnique({
    // Exclude password and other sensitive fields
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    },
    where: { id },
  });
}

export const findByEmail = async (email) => {
  return await prisma.user.findUnique({
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    },
    where: { email },
  });
}