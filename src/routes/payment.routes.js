import express from "express";
import { validateBody } from "../middlewares/validator.middleware.js";
import * as PaymentController from "../controllers/payment.controller.js";
import { paymentSchema } from "../validators/payment.validator.js";

const router = express.Router();

// Only callback endpoint since payment is created during rental process
router.post("/callback", [validateBody(paymentSchema)], PaymentController.paymentCallback);

export default router;
