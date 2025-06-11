import Joi from "joi";

export const vehicleSchema = Joi.object({
    name: Joi.string().min(3).required(),
    licensePlate: Joi.string().min(1).required(),
    brand: Joi.string().min(1).required(),
    year: Joi.number()
        .integer()
        .min(1886)
        .max(new Date().getFullYear())
        .required(),
    isAvailable: Joi.boolean().default(true),
    pricePerDay: Joi.number().positive().required(),
    type: Joi.string().valid("car", "motorcycle").required(),
    status: Joi.string().valid("available", "rented", "booked", "maintenance", "unavailable").default("available"),
}).custom((value, helpers) => {
    // Custom validation logic can be added here if needed
    if (value.year < 1886 || value.year > new Date().getFullYear()) {
        return helpers.message('Year must be between 1886 and the current year');
    }
    return value;
});

export const updateVehicleSchema = vehicleSchema.fork(
    ["name", "licensePlate", "brand", "year", "isAvailable", "pricePerDay", "type"],
    (field) => field.optional()
);

export const findVehicleByIdSchema = Joi.object({
    id: Joi.string().required(),
});

export const findVehiclesByOwnerIdSchema = Joi.object({
    ownerId: Joi.string().required(),
});

export const findVehiclesByPlateNumberSchema = Joi.object({
    plateNumber: Joi.string().required(),
});

export const priceFilterSchema = Joi.object({
    minPrice: Joi.number().positive().optional(),
    maxPrice: Joi.number().positive().optional(),
    exactPrice: Joi.number().positive().optional()
}).custom((value, helpers) => {
    // At least one price filter required
    if (!value.minPrice && !value.maxPrice && !value.exactPrice) {
        return helpers.message('At least one price filter (minPrice, maxPrice, or exactPrice) is required');
    }
    
    // exactPrice cannot be combined with range
    if (value.exactPrice && (value.minPrice || value.maxPrice)) {
        return helpers.message('exactPrice cannot be combined with minPrice or maxPrice');
    }
    
    return value;
});

export const findVehiclesByYearSchema = Joi.object({
    year: Joi.number()
        .integer()
        .min(1886)
        .max(new Date().getFullYear())
        .required(),
});

export const findVehiclesByBrandSchema = Joi.object({
    brand: Joi.string().min(1).required(),
});

export const findVehiclesByTypeSchema = Joi.object({
    type: Joi.string().valid("car", "motorcycle").required(),
});

export const findVehiclesByNameSchema = Joi.object({
    name: Joi.string().min(1).required(),
});