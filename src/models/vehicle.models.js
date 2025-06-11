
import prisma from "../lib/prisma.js";

export const findAllVehicles = async () => {
    return await prisma.vehicle.findMany();
};

export const findVehicleById = async (id) => {
    console.log("A");
    id = parseInt(id);
    if (isNaN(id)) {
        throw new Error("Vehicle ID must be a number");
    }
    return await prisma.vehicle.findUnique({
        where: { id },
    });
};

export const createVehicle = async (data) => {
    return await prisma.vehicle.create({
        data,
    });
};

export const updateVehicle = async (id, data) => {
    console.log("B");
    id = parseInt(id);
    if (isNaN(id)) {
        throw new Error("Vehicle ID must be a number");
    }
    return await prisma.vehicle.update({
        where: { id },
        data,
    });
};

export const deleteVehicle = async (id) => {
    console.log("C");
    id = parseInt(id);
    if (isNaN(id)) {
        throw new Error("Vehicle ID must be a number");
    }
    return await prisma.vehicle.delete({
        where: { id },
    });
};

export const findVehiclesByOwnerId = async (ownerId) => {
    return await prisma.vehicle.findMany({
        where: { ownerId },
    });
};

export const findVehiclesByPlateNumber = async (licensePlate) => {
    return await prisma.vehicle.findMany({
        where: { licensePlate },
    });
};

export const findVehiclesByBrand = async (brand) => {
    return await prisma.vehicle.findMany({
        where: { brand },
    });
};

export const findVehicleByYear = async (year) => {
    year = parseInt(year);
    if (isNaN(year)) {
        throw new Error("Year must be a number");
    }
    return await prisma.vehicle.findMany({
        where: { year },
    });
};

export const findVehiclesAvailableForRent = async () => {
    return await prisma.vehicle.findMany({
        where: { isAvailable: true, status: "available" }
    });
};

export const findVehiclesByPrice = async (minPrice, maxPrice, exactPrice) => {
    const where = {};
    if (minPrice) {
        where.pricePerDay = { gte: parseFloat(minPrice) };
    }
    if (maxPrice) {
        where.pricePerDay = { lte: parseFloat(maxPrice) };
    }
    if (exactPrice) {
        where.pricePerDay = parseFloat(exactPrice);
    }
    return await prisma.vehicle.findMany({
        where,
    });
};

export const findVehiclesByType = async (type) => {
    return await prisma.vehicle.findMany({
        where: { type },
    });
}

export const findVehiclesByName = async (name) => {
    return await prisma.vehicle.findMany({
        where: {
            name: {
                contains: name
            },
        },
    });
}