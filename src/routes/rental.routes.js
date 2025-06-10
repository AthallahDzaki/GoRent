import express from "express";
import { isAdmin, isAuthenticate } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validator.middleware.js";
import * as RentalController from "../controllers/rental.controller.js";
import * as RentalValidator from "../validators/rental.validator.js";

const router = express.Router();

// Rental operations
router.post(
    "/",
    [isAuthenticate, validateBody(RentalValidator.rentVehicleSchema)],
    RentalController.rentVehicle
);
router.post(
    "/return",
    [isAuthenticate, validateBody(RentalValidator.returnVehicleSchema)],
    RentalController.returnVehicle
);

// Rental management
router.get("/my-rentals", [isAuthenticate], RentalController.getMyRentals);

router.get("/", [isAuthenticate, isAdmin], RentalController.getAllRentals);
router.get("/user/:userId", [isAuthenticate, isAdmin], RentalController.getRentalsByUserId);
router.get(
    "/vehicle/:vehicleId",
    [isAuthenticate, isAdmin],
    RentalController.getRentalsByVehicleId
);
router.get("/:id", [isAuthenticate, isAdmin], RentalController.getRentalById);

router.put(
    "/:id",
    [isAuthenticate, isAdmin, validateBody(RentalValidator.updateRentalSchema)],
    RentalController.updateRental
);
router.delete("/:id", [isAuthenticate, isAdmin], RentalController.cancelRental);

export default router;
