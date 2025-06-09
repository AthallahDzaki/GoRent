import express from "express";
import { isAuthenticate } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validator.middleware.js";
import * as PaymentController from "../controllers/payment.controller.js";
import { paymentSchema } from "../validators/payment.validator.js";

const router = express.Router();

router.post("/", [isAuthenticate, validateBody(paymentSchema)], PaymentController.processPayment);
router.post("/callback", [validateBody(paymentSchema)], PaymentController.paymentCallback);

export default router;