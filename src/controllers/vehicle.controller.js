import * as vehicleService from "../services/vehicle.service.js";

export const getAllVehicles = async (req, res) => {
    try {
        const vehicles = await vehicleService.findAllVehicles();
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getVehicleById = async (req, res) => {
    try {
        const vehicle = await vehicleService.findVehicleById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ error: "Vehicle not found" });
        }
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createVehicle = async (req, res) => {
    try {
        const vehicle = await vehicleService.createVehicle(req.body);
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateVehicle = async (req, res) => {
    try {
        const vehicle = await vehicleService.updateVehicle(
            req.params.id,
            req.body
        );
        if (!vehicle) {
            return res.status(404).json({ error: "Vehicle not found" });
        }
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await vehicleService.deleteVehicle(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ error: "Vehicle not found" });
        }
        res.json({ message: "Vehicle deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getVehiclesByOwnerId = async (req, res) => {
    try {
        const vehicles = await vehicleService.findVehiclesByOwnerId(
            req.params.ownerId
        );
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getVehiclesByStatus = async (req, res) => {
    try {
        const vehicles = await vehicleService.findVehiclesByStatus(
            req.params.status
        );
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getVehiclesByPlateNumber = async (req, res) => {
    try {
        const vehicles = await vehicleService.findVehiclesByPlateNumber(
            req.params.plateNumber
        );
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getVehiclesByBrand = async (req, res) => {
    try {
        const vehicles = await vehicleService.findVehiclesByBrand(
            req.params.brand
        );
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getVehiclesByYear = async (req, res) => {
    try {
        const vehicles = await vehicleService.findVehicleByYear(
            req.params.year
        );
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getVehiclesAvailableForRent = async (req, res) => {
    try {
        const vehicles = await vehicleService.findVehiclesAvailableForRent();
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getVehiclesByPriceRange = async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.query;
        const vehicles = await vehicleService.findVehicleByPriceRange(
            minPrice,
            maxPrice
        );
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
