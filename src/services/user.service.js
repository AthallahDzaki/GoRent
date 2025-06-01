import prisma from "../lib/prisma.js";

export const findAll = async () => {
  return await prisma.user.findMany();
}

export const findById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
  });
}

export const findByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
}