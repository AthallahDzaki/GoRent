import { register, login, refreshAccessToken } from '../services/auth.service.js';

export const registerUser = async (req, res) => {
  try {
    const data = req.body;
    const result = await register(data);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const data = req.body;
    const result = await login(data);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    // Implementasi logout (blacklist token)
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await refreshAccessToken(refreshToken);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};
