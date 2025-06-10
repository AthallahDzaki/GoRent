//**
// Routes configuration for the application
// This file defines the routes and their corresponding components
import express from "express";
// This section imports the necessary modules and components for routing
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import vehicleRoutes from "./routes/vehicle.routes.js";
import rentalRoutes from "./routes/rental.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
// End of imports

const router = express.Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/vehicles", vehicleRoutes);
router.use("/rentals", rentalRoutes);
router.use("/payments", paymentRoutes);

export default router;
//**
