//**
// Routes configuration for the application
// This file defines the routes and their corresponding components
import express from 'express';
// This section imports the necessary modules and components for routing
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
// End of imports

const router = express.Router();
// Importing user routes
router.use('/users', userRoutes);
// Importing authentication routes
router.use('/auth', authRoutes);
export default router;
//**