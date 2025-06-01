import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const generateToken = (payload) =>
    jwt.sign(payload, SECRET, { expiresIn: '1d', algorithm: 'HS256' });

export const generateRefreshToken = (payload) =>
    jwt.sign(payload, SECRET, { expiresIn: '7d', algorithm: 'HS256' });

export const verifyToken = (token) =>
  jwt.verify(token, SECRET);
