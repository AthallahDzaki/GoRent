import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import { generateToken } from '../utils/jwt.js';

export const register = async ({ name, email, password }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('Email already registered');

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hash },
  });

  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
};

export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('Invalid credentials');

  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
};
