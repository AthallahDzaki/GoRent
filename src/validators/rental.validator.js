import Joi from "joi";

export const rentVehicleSchema = Joi.object({
    vehicleId: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().greater(Joi.ref("startDate")).required(),
    paymentMethod: Joi.string().valid("credit_card", "cash", "ewallet").required(),
});

export const returnVehicleSchema = Joi.object({
    rentalId: Joi.string().required(),
});

// booked
// ongoing
// completed
// cancelled

export const updateRentalSchema = Joi.object({
    status: Joi.string().valid("booked", "ongoing", "completed", "cancelled").required(),
    endDate: Joi.date().greater(Joi.ref("startDate")).optional(), // Optional if only updating status
    paymentMethod: Joi.string().valid("credit_card", "cash", "ewallet").optional(),
    userId: Joi.string().optional(), // Optional if not updating user
    vehicleId: Joi.string().optional(), // Optional if not updating vehicle
    startDate: Joi.date().optional(), // Optional if not updating start date
}).custom((value, helpers) => {
    // Ensure that if status is 'completed', endDate must be provided
    if (value.status === "completed" && !value.endDate) {
        return helpers.message("endDate is required when status is completed");
    }

    // Ensure that if status is 'cancelled', endDate must not be provided
    if (value.status === "cancelled" && value.endDate) {
        return helpers.message("endDate should not be provided when status is cancelled");
    }

    return value;
});
