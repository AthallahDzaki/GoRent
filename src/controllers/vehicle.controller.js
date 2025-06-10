import * as vehicleModel from "../models/vehicle.models.js";
import { ErrorHandler } from "../models/error.models.js";

export const getAllVehicles = async (req, res, next) => {
    try {
        const vehicles = await vehicleModel.findAllVehicles();
        if (!vehicles || vehicles.length === 0) {
            throw new ErrorHandler(404, "No vehicles found");
        }
        res.json({
            success: true,
            message: "Vehicles fetched successfully",
            data: vehicles,
        });
    } catch (error) {
        next(error);
    }
};

export const getVehicleById = async (req, res, next) => {
    try {
        const vehicle = await vehicleModel.findVehicleById(req.params.id);
        if (!vehicle) {
            throw new ErrorHandler(404, "Vehicle not found");
        }
        res.json({
            success: true,
            message: "Vehicle fetched successfully",
            data: vehicle,
        });
    } catch (error) {
        next(error);
    }
};

export const createVehicle = async (req, res, next) => {
    try {
        const vehicle = await vehicleModel.createVehicle(req.body);
        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: vehicle,
        });
    } catch (error) {
        next(error);
    }
};

export const updateVehicle = async (req, res, next) => {
    try {
        const existingVehicle = await vehicleModel.findVehicleById(req.params.id);
        if (!existingVehicle) {
            throw new ErrorHandler(404, "Vehicle not found");
        }

        const updatedVehicle = await vehicleModel.updateVehicle(req.params.id, req.body);
        res.json({
            success: true,
            message: "Vehicle updated successfully",
            data: updatedVehicle,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteVehicle = async (req, res, next) => {
    try {
        const existingVehicle = await vehicleModel.findVehicleById(req.params.id);
        if (!existingVehicle) {
            throw new ErrorHandler(404, "Vehicle not found");
        }

        await vehicleModel.deleteVehicle(req.params.id);
        res.json({
            success: true,
            message: "Vehicle deleted successfully",
            data: null,
        });
    } catch (error) {
        next(error);
    }
};

export const getVehiclesByOwnerId = async (req, res, next) => {
    try {
        const vehicles = await vehicleModel.findVehiclesByOwnerId(req.params.ownerId);
        if (!vehicles || vehicles.length === 0) {
            throw new ErrorHandler(404, "No vehicles found for this owner");
        }
        res.json({
            success: true,
            message: "Vehicles fetched successfully",
            data: vehicles,
        });
    } catch (error) {
        next(error);
    }
};

export const getVehiclesByStatus = async (req, res, next) => {
    try {
        const { status } = req.params;

        // Validate status parameter
        const validStatuses = ["true", "false"];
        if (!validStatuses.includes(status.toLowerCase())) {
            throw new ErrorHandler(400, "Invalid status. Use 'true' or 'false'");
        }

        const isAvailable = status.toLowerCase() === "true";
        const vehicles = await vehicleModel.findVehiclesByStatus(isAvailable);

        if (!vehicles || vehicles.length === 0) {
            throw new ErrorHandler(404, `No vehicles found with status: ${status}`);
        }

        res.json({
            success: true,
            message: "Vehicles fetched successfully",
            data: vehicles,
        });
    } catch (error) {
        next(error);
    }
};

export const getVehiclesByPlateNumber = async (req, res, next) => {
    try {
        const vehicle = await vehicleModel.findVehiclesByPlateNumber(req.params.plateNumber);
        if (!vehicle || vehicle.length === 0) {
            throw new ErrorHandler(404, "No vehicle found with this plate number");
        }
        res.json({
            success: true,
            message: "Vehicle fetched successfully",
            data: vehicle,
        });
    } catch (error) {
        next(error);
    }
};

export const getVehiclesByBrand = async (req, res, next) => {
    try {
        const vehicles = await vehicleModel.findVehiclesByBrand(req.params.brand);
        if (!vehicles || vehicles.length === 0) {
            throw new ErrorHandler(404, "No vehicles found for this brand");
        }
        res.json({
            success: true,
            message: "Vehicles fetched successfully",
            data: vehicles,
        });
    } catch (error) {
        next(error);
    }
};

export const getVehiclesByYear = async (req, res, next) => {
    try {
        const { year } = req.params;

        // Validate year
        const yearNum = parseInt(year);
        if (isNaN(yearNum) || yearNum < 1886 || yearNum > new Date().getFullYear()) {
            throw new ErrorHandler(400, "Invalid year");
        }

        const vehicles = await vehicleModel.findVehicleByYear(year);
        if (!vehicles || vehicles.length === 0) {
            throw new ErrorHandler(404, "No vehicles found for this year");
        }
        res.json({
            success: true,
            message: "Vehicles fetched successfully",
            data: vehicles,
        });
    } catch (error) {
        next(error);
    }
};

export const getVehiclesAvailableForRent = async (req, res, next) => {
    try {
        const vehicles = await vehicleModel.findVehiclesAvailableForRent();
        if (!vehicles || vehicles.length === 0) {
            throw new ErrorHandler(404, "No vehicles available for rent");
        }
        res.json({
            success: true,
            message: "Available vehicles fetched successfully",
            data: vehicles,
        });
    } catch (error) {
        next(error);
    }
};

export const getVehiclesByPrice = async (req, res, next) => {
    try {
        const { minPrice, maxPrice, exactPrice } = req.query;

        // Validation
        if (!minPrice && !maxPrice && !exactPrice) {
            throw new ErrorHandler(
                400,
                "At least one price filter (minPrice, maxPrice, or exactPrice) is required"
            );
        }

        if (exactPrice && (minPrice || maxPrice)) {
            throw new ErrorHandler(400, "exactPrice cannot be combined with minPrice or maxPrice");
        }

        // Validate price values
        if (minPrice && (isNaN(minPrice) || parseFloat(minPrice) < 0)) {
            throw new ErrorHandler(400, "minPrice must be a positive number");
        }

        if (maxPrice && (isNaN(maxPrice) || parseFloat(maxPrice) < 0)) {
            throw new ErrorHandler(400, "maxPrice must be a positive number");
        }

        if (exactPrice && (isNaN(exactPrice) || parseFloat(exactPrice) < 0)) {
            throw new ErrorHandler(400, "exactPrice must be a positive number");
        }

        if (minPrice && maxPrice && parseFloat(minPrice) > parseFloat(maxPrice)) {
            throw new ErrorHandler(400, "minPrice cannot be greater than maxPrice");
        }

        const vehicles = await vehicleModel.findVehiclesByPrice(minPrice, maxPrice, exactPrice);
        if (!vehicles || vehicles.length === 0) {
            throw new ErrorHandler(404, "No vehicles found in this price range");
        }

        res.json({
            success: true,
            message: "Vehicles fetched successfully",
            data: vehicles,
            filters: { minPrice, maxPrice, exactPrice },
        });
    } catch (error) {
        next(error);
    }
};

export const getVehiclesByType = async (req, res, next) => {
    try {
        const { type } = req.params;

        // Validate vehicle type
        const validTypes = ["car", "motorcycle"];
        if (!validTypes.includes(type.toLowerCase())) {
            throw new ErrorHandler(
                400,
                `Invalid vehicle type. Valid types: ${validTypes.join(", ")}`
            );
        }

        const vehicles = await vehicleModel.findVehiclesByType(type.toLowerCase());
        if (!vehicles || vehicles.length === 0) {
            throw new ErrorHandler(404, "No vehicles found for this type");
        }
        res.json({
            success: true,
            message: "Vehicles fetched successfully",
            data: vehicles,
        });
    } catch (error) {
        next(error);
    }
};

export const getVehiclesByName = async (req, res, next) => {
    try {
        const { name } = req.params;

        // Validate name parameter
        if (!name || name.trim().length === 0) {
            throw new ErrorHandler(400, "Vehicle name cannot be empty");
        }

        const vehicles = await vehicleModel.findVehiclesByName(name);
        if (!vehicles || vehicles.length === 0) {
            throw new ErrorHandler(404, "No vehicles found with this name");
        }
        res.json({
            success: true,
            message: "Vehicles fetched successfully",
            data: vehicles,
        });
    } catch (error) {
        next(error);
    }
};

export const searchVehicles = async (req, res, next) => {
    try {
        const {
            brand,
            type,
            year,
            minPrice,
            maxPrice,
            isAvailable,
            name,
            page = 1,
            limit = 10,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = req.query;

        // Build where clause
        const where = {};

        if (brand) where.brand = { contains: brand, mode: "insensitive" };
        if (type) where.type = type.toLowerCase();
        if (year) where.year = parseInt(year);
        if (name) where.name = { contains: name, mode: "insensitive" };
        if (isAvailable !== undefined) where.isAvailable = isAvailable === "true";

        if (minPrice || maxPrice) {
            where.pricePerDay = {};
            if (minPrice) where.pricePerDay.gte = parseFloat(minPrice);
            if (maxPrice) where.pricePerDay.lte = parseFloat(maxPrice);
        }

        const vehicles = await vehicleModel.searchVehicles(where, {
            page: parseInt(page),
            limit: parseInt(limit),
            sortBy,
            sortOrder,
        });

        if (!vehicles.data || vehicles.data.length === 0) {
            throw new ErrorHandler(404, "No vehicles found matching the criteria");
        }

        res.json({
            success: true,
            message: "Vehicles search completed successfully",
            data: vehicles.data,
            pagination: vehicles.pagination,
        });
    } catch (error) {
        next(error);
    }
};
