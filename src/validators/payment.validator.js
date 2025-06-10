import Joi from "joi";

export const paymentSchema = Joi.object({
    id: Joi.string().required(), // Transaction ID dari Payment
    external_id: Joi.string().required(), // ID dari aplikasi kita
    reference_id: Joi.string().optional(), // Untuk e-wallet
    status: Joi.string().required(),
    amount: Joi.number().positive().required(),
    paid_amount: Joi.number().min(0).optional(),
    capture_amount: Joi.number().min(0).optional(),
    payment_method: Joi.string().required(),
    channel_code: Joi.string().optional(),
    bank_code: Joi.string().optional(),
});
