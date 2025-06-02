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
});

export const updateVehicleSchema = vehicleSchema.fork(
    ["name", "licensePlate", "brand", "year", "isAvailable", "pricePerDay"],
    (field) => field.optional()
);

export const findVehicleByIdSchema = Joi.object({
    id: Joi.string().required(),
});

export const findVehiclesByOwnerIdSchema = Joi.object({
    ownerId: Joi.string().required(),
});

export const findVehiclesByStatusSchema = Joi.object({
    status: Joi.string().valid("available", "rented").required(),
});

export const findVehiclesByPlateNumberSchema = Joi.object({
    plateNumber: Joi.string().required(),
});

export const findVehiclesByPriceRangeSchema = Joi.object({
    minPrice: Joi.number().positive().required(),
    maxPrice: Joi.number().positive().required(),
});

export const findVehiclesAvailableForRentSchema = Joi.object({
    isAvailable: Joi.boolean().default(true),
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
