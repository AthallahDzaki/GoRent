import prisma from "../lib/prisma.js";

// Create rental
export const createRental = async (data) => {
    return await prisma.rental.create({ data });
};

// Find all rentals
export const findAllRentals = async () => {
    return await prisma.rental.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            vehicle: {
                select: {
                    id: true,
                    name: true,
                    brand: true,
                    licensePlate: true,
                },
            },
        },
    });
};

// Find rental by ID
export const findRentalById = async (id) => {
    id = parseInt(id);
    if (isNaN(id)) {
        throw new Error("Rental ID must be a number");
    }
    return await prisma.rental.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            vehicle: {
                select: {
                    id: true,
                    name: true,
                    brand: true,
                    licensePlate: true,
                },
            },
        },
    });
};

// Find rentals by user ID
export const findRentalsByUserId = async (userId) => {
    userId = parseInt(userId);
    if (isNaN(userId)) {
        throw new Error("User ID must be a number");
    }
    return await prisma.rental.findMany({
        where: { userId },
        include: {
            vehicle: {
                select: {
                    id: true,
                    name: true,
                    brand: true,
                    licensePlate: true,
                },
            },
        },
    });
};

// Update rental
export const updateRental = async (id, data) => {
    id = parseInt(id);
    if (isNaN(id)) {
        throw new Error("Rental ID must be a number");
    }
    return await prisma.rental.update({
        where: { id },
        data,
    });
};

// Update rental status
export const updateRentalStatus = async (id, status) => {
    id = parseInt(id);
    if (isNaN(id)) {
        throw new Error("Rental ID must be a number");
    }
    return await prisma.rental.update({
        where: { id },
        data: { status },
    });
};

// Delete rental
export const deleteRental = async (id) => {
    id = parseInt(id);
    if (isNaN(id)) {
        throw new Error("Rental ID must be a number");
    }
    return await prisma.rental.delete({
        where: { id },
    });
};

// Find rentals by status
export const findRentalsByStatus = async (status) => {
    return await prisma.rental.findMany({
        where: { status },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            vehicle: {
                select: {
                    id: true,
                    name: true,
                    brand: true,
                    licensePlate: true,
                },
            },
        },
    });
};

export const findRentalsByVehicleId = async (vehicleId) => {
    vehicleId = parseInt(vehicleId);
    if (isNaN(vehicleId)) {
        throw new Error("Vehicle ID must be a number");
    }
    return await prisma.rental.findMany({
        where: { vehicleId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
};
