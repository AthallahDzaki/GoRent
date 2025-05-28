import prisma from "../lib/prisma.js";

export const findAll = async () => {
  return await prisma.user.findMany();
}

export const create = async (data) => {
  // Check if data is valid
  if (typeof data !== 'object') { 
    throw new Error("Invalid data format");
  }
  if (!data.name || !data.email || !data.password) {
    throw new Error("Missing required fields: name, email, password");
  }
  return await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password, // Ensure to hash the password before storing it in production
    },
  });
}