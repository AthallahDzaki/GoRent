import prisma from "../lib/prisma.js";

export const findAllVehicles = async () => {
    return await prisma.vehicle.findMany();
};

export const findVehicleById = async (id) => {
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
    return await prisma.vehicle.update({
        where: { id },
        data,
    });
};

export const deleteVehicle = async (id) => {
    return await prisma.vehicle.delete({
        where: { id },
    });
};

export const findVehiclesByOwnerId = async (ownerId) => {
    return await prisma.vehicle.findMany({
        where: { ownerId },
    });
};

export const findVehiclesByStatus = async (status) => {
    return await prisma.vehicle.findMany({
        where: { status },
    });
};

export const findVehiclesByPlateNumber = async (plateNumber) => {
    return await prisma.vehicle.findMany({
        where: { plateNumber },
    });
};

export const findVehiclesByBrand = async (brand) => {
    return await prisma.vehicle.findMany({
        where: { brand },
    });
};

export const findVehicleByYear = async (year) => {
    return await prisma.vehicle.findMany({
        where: { year },
    });
};

export const findVehiclesAvailableForRent = async () => {
    return await prisma.vehicle.findMany({
        where: { status: "available" },
    });
};

export const findVehicleByPriceRange = async (minPrice, maxPrice) => {
    return await prisma.vehicle.findMany({
        where: {
            price: {
                gte: minPrice,
                lte: maxPrice,
            },
        },
    });
};
