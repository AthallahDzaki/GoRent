import { isAdmin, isAuthenticate } from "../middlewares/auth.middleware.js";
import validateBody from "../middlewares/validateBody.middleware.js";

import * as VehicleController from "../controllers/vehicle.controller.js";
import * as VehicleValidator from "../validators/vehicle.validator.js";
import express from "express";
import { deleteVehicle } from "../services/vehicle.service.js";

const router = express.Router();

router.post(
    "/",
    [isAuthenticate, isAdmin, validateBody(VehicleValidator.vehicleSchema)],
    VehicleController.createVehicle
);
router.put(
    "/:id",
    [isAuthenticate, isAdmin, validateBody(VehicleValidator.updateVehicleSchema)],
    VehicleController.updateVehicle
);
router.delete("/:id", [isAuthenticate, isAdmin], deleteVehicle);
router.patch(
    "/:id",
    [isAuthenticate, isAdmin, validateBody(VehicleValidator.updateVehicleSchema)],
    VehicleController.updateVehicle
);

1;
router.get("/", [isAuthenticate, isAdmin], VehicleController.getAllVehicles);
router.get(
    "/owner/:ownerId",
    [isAuthenticate, isAdmin, validateBody(VehicleValidator.findVehiclesByOwnerIdSchema)],
    VehicleController.getVehiclesByOwnerId
);
router.get(
    "/status/:status",
    [isAuthenticate, isAdmin, validateBody(VehicleValidator.findVehiclesByStatusSchema)],
    VehicleController.getVehiclesByStatus
);
router.get(
    "/plate/:plateNumber",
    [isAuthenticate, isAdmin, validateBody(VehicleValidator.findVehiclesByPlateNumberSchema)],
    VehicleController.getVehiclesByPlateNumber
);

router.get(
    "/:id",
    [isAuthenticate, validateBody(VehicleValidator.findVehicleByIdSchema)],
    VehicleController.getVehicleById
);
router.get(
    "/price",
    [isAuthenticate, validateBody(VehicleValidator.findVehiclesByPriceRangeSchema)],
    VehicleController.getVehiclesByPriceRange
);
router.get(
    "/available",
    [isAuthenticate, validateBody(VehicleValidator.findVehiclesAvailableForRentSchema)],
    VehicleController.getVehiclesAvailableForRent
);
router.get(
    "/year/:year",
    [isAuthenticate, validateBody(VehicleValidator.findVehiclesByYearSchema)],
    VehicleController.getVehiclesByYear
);
router.get(
    "/brand/:brand",
    [isAuthenticate, validateBody(VehicleValidator.findVehiclesByBrandSchema)],
    VehicleController.getVehiclesByBrand
);

export default router;
