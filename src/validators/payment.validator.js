import Joi from "joi";

export const paymentSchema = Joi.object({
    amount: Joi.number().positive().required(),
    status: Joi.string().valid("completed", "failed").required(),
    method: Joi.string().valid("credit_card", "ewallet").required(),
    transactionId: Joi.string().optional(), // Optional field for transaction ID
});