import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/auth.controller.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import validateBody from '../middlewares/validateBody.middleware.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), registerUser);
router.post('/login', validateBody(loginSchema), loginUser);
router.post('/logout', logoutUser);

export default router;
