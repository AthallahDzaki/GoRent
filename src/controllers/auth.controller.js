import { register, login } from '../services/auth.service.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';

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
