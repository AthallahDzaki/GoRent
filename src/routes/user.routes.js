import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import * as authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
    "/",
    [authMiddleware.isAuthenticate, authMiddleware.isAdmin],
    userController.getAllUsers
);
router.get("/profile", [authMiddleware.isAuthenticate], userController.getUserProfile);

export default router;
