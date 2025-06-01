import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import { generateToken, generateRefreshToken } from '../utils/jwt.js';

export const register = async ({ name, email, password }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('Email already registered');

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hash },
  });

  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id, email: user.email, role: user.role });
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token, refreshToken };
};

export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('Invalid credentials');

  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id, email: user.email, role: user.role });
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token, refreshToken };
};

export const refreshAccessToken = async (refreshToken) => {
  const payload = verifyRefreshToken(refreshToken);
  if (!payload) throw new Error('Invalid refresh token');

  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (!user) throw new Error('User not found');

  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
};

const verifyRefreshToken = (token) => {
  try {
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    return payload;
  } catch (err) {
    throw new Error('Invalid refresh token');
  }
}