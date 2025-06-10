import express from "express";
import { isAdmin, isAuthenticate } from "../middlewares/auth.middleware.js";
import {
    validateBody,
    validateParams,
    validateQuery,
} from "../middlewares/validator.middleware.js";
import * as VehicleController from "../controllers/vehicle.controller.js";
import * as VehicleValidator from "../validators/vehicle.validator.js";

const router = express.Router();

// Vehicle CRUD operations
router.get("/", [isAuthenticate, isAdmin], VehicleController.getAllVehicles);
router.post(
    "/",
    [isAuthenticate, isAdmin, validateBody(VehicleValidator.vehicleSchema)],
    VehicleController.createVehicle
);

// Vehicle search/filter operations (routes spesifik)
router.get(
    "/plate/:plateNumber",
    [isAuthenticate, isAdmin, validateParams(VehicleValidator.findVehiclesByPlateNumberSchema)],
    VehicleController.getVehiclesByPlateNumber
);
router.get("/available", [isAuthenticate], VehicleController.getVehiclesAvailableForRent);
router.get(
    "/type/:type",
    [isAuthenticate, validateParams(VehicleValidator.findVehiclesByTypeSchema)],
    VehicleController.getVehiclesByType
);
router.get(
    "/name/:name",
    [isAuthenticate, validateParams(VehicleValidator.findVehiclesByNameSchema)],
    VehicleController.getVehiclesByName
);
router.get(
    "/year/:year",
    [isAuthenticate, validateParams(VehicleValidator.findVehiclesByYearSchema)],
    VehicleController.getVehiclesByYear
);
router.get(
    "/brand/:brand",
    [isAuthenticate, validateParams(VehicleValidator.findVehiclesByBrandSchema)],
    VehicleController.getVehiclesByBrand
);
router.get(
    "/price",
    [isAuthenticate, validateQuery(VehicleValidator.priceFilterSchema)],
    VehicleController.getVehiclesByPrice
);

router.get(
    "/:id",
    [isAuthenticate, isAdmin, validateParams(VehicleValidator.findVehicleByIdSchema)],
    VehicleController.getVehicleById
);
router.put(
    "/:id",
    [isAuthenticate, isAdmin, validateBody(VehicleValidator.updateVehicleSchema)],
    VehicleController.updateVehicle
);
router.delete(
    "/:id",
    [isAuthenticate, isAdmin, validateParams(VehicleValidator.findVehicleByIdSchema)],
    VehicleController.deleteVehicle
);

export default router;
