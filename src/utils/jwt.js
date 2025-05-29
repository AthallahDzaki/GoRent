import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const generateToken = (payload) =>
    jwt.sign(payload, SECRET, { expiresIn: '7d' });

export const verifyToken = (token) =>
  jwt.verify(token, SECRET);
