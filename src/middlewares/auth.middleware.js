import jwt from 'jsonwebtoken';
import { generateToken } from '../utils/jwt.js';

const SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Pastikan ini diatur di .env
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'your_refresh_token_secret'; // Pastikan ini diatur di .env
/**
 * Middleware untuk otentikasi pengguna
 * Memeriksa token JWT di header Authorization
 * Jika token tidak ada atau tidak valid, mengembalikan status 401 Unauthorized
 * Jika token valid, menyimpan informasi pengguna di req.user
 */

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // Simpan info user di req.user
    next();
  } catch (err) {
    // Check refresh token if available
    if (req.body.refreshToken) {
      const refreshToken = req.body.refreshToken;
      try {
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        // Jika refresh token valid, buat token baru
        const newToken = generateToken({ id: decoded.id, email: decoded.email, role: decoded.role });
        // Set token baru di header Authorization
        res.setHeader('Authorization', `Bearer ${newToken}`); // Set token baru di header
        req.user = decoded; // Simpan info user di req.user
        next();
      } catch (err) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }
    } else {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};