import express from "express";
import * as authController from "../controllers/auth.controller.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { validateBody } from "../middlewares/validator.middleware.js";
import { isAuthenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", [validateBody(registerSchema)], authController.registerUser);
router.post("/login", [validateBody(loginSchema)], authController.loginUser);
router.post("/logout", [isAuthenticate], authController.logoutUser);

export default router;
