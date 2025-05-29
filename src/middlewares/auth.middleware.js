import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Pastikan ini diatur di .env

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // Simpan info user di req.user
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
