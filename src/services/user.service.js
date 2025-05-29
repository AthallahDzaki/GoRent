import prisma from "../lib/prisma.js";

export const findAll = async () => {
  return await prisma.user.findMany();
}