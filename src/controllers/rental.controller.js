import * as vehicleModel from "../models/vehicle.models.js";
import * as rentModel from "../models/rent.models.js";
import { ErrorHandler } from "../models/error.models.js";
import prisma from "../lib/prisma.js";

export const rentVehicle = async (req, res, next) => {
    try {
        const { vehicleId, startDate, endDate, paymentMethod } = req.body;
        const userId = req.user.id;

        const result = await prisma.$transaction(async (tx) => {
            // Check vehicle availability
            const vehicle = await vehicleModel.findVehicleById(vehicleId);
            if (!vehicle) {
                throw new ErrorHandler(404, "Vehicle not found");
            }
            if (!vehicle.isAvailable) {
                throw new ErrorHandler(400, "Vehicle is not available for rent");
            }

            // Calculate total price
            const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
            const totalPrice = days * vehicle.pricePerDay;

            // Create rental
            const rental = await tx.rental.create({
                data: {
                    userId,
                    vehicleId: parseInt(vehicleId),
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    totalPrice,
                    status: 'booked'
                }
            });

            // Update vehicle availability
            await tx.vehicle.update({
                where: { id: parseInt(vehicleId) },
                data: { isAvailable: false }
            });

            // Create payment record
            const payment = await tx.payment.create({
                data: {
                    rentalId: rental.id,
                    method: paymentMethod || 'credit_card',
                    amount: totalPrice,
                    status: 'pending'
                }
            });

            return { rental, payment };
        });

        res.json({
            success: true,
            message: "Vehicle rented successfully",
            data: {
                rental: result.rental,
                payment: result.payment
            }
        });

    } catch (error) {
        next(error);
    }
};

export const returnVehicle = async (req, res, next) => {
    try {
        const { rentalId } = req.body;

        const result = await prisma.$transaction(async (tx) => {
            // Find rental
            const rental = await rentModel.findRentalById(rentalId);
            if (!rental) {
                throw new ErrorHandler(404, "Rental not found");
            }
            if (rental.status === 'completed') {
                throw new ErrorHandler(400, "Vehicle already returned");
            }

            // Update rental status
            const updatedRental = await tx.rental.update({
                where: { id: parseInt(rentalId) },
                data: { status: 'completed' }
            });

            // Update vehicle availability
            const updatedVehicle = await tx.vehicle.update({
                where: { id: rental.vehicleId },
                data: { isAvailable: true }
            });

            // Update payment status
            await tx.payment.updateMany({
                where: { rentalId: parseInt(rentalId) },
                data: { 
                    status: 'completed',
                    paidAt: new Date()
                }
            });

            return { rental: updatedRental, vehicle: updatedVehicle };
        });

        res.json({
            success: true,
            message: "Vehicle returned successfully",
            data: result
        });

    } catch (error) {
        next(error);
    }
};

export const getAllRentals = async (req, res, next) => {
    try {
        const rentals = await rentModel.findAllRentals();
        
        res.json({
            success: true,
            message: "Rentals retrieved successfully",
            data: rentals
        });
    } catch (error) {
        next(error);
    }
};

export const getRentalById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const rental = await rentModel.findRentalById(id);
        
        if (!rental) {
            throw new ErrorHandler(404, "Rental not found");
        }

        res.json({
            success: true,
            message: "Rental retrieved successfully",
            data: rental
        });
    } catch (error) {
        next(error);
    }
};

export const getRentalsByUserId = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const rentals = await rentModel.findRentalsByUserId(userId);
        
        res.json({
            success: true,
            message: "User rentals retrieved successfully",
            data: rentals
        });
    } catch (error) {
        next(error);
    }
};

export const getMyRentals = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const rentals = await rentModel.findRentalsByUserId(userId);
        
        res.json({
            success: true,
            message: "My rentals retrieved successfully",
            data: rentals
        });
    } catch (error) {
        next(error);
    }
};

export const updateRental = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Check if rental exists
        const existingRental = await rentModel.findRentalById(id);
        if (!existingRental) {
            throw new ErrorHandler(404, "Rental not found");
        }

        const updatedRental = await rentModel.updateRental(id, updateData);
        
        res.json({
            success: true,
            message: "Rental updated successfully",
            data: updatedRental
        });
    } catch (error) {
        next(error);
    }
};

export const updateRentalStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Check if rental exists
        const existingRental = await rentModel.findRentalById(id);
        if (!existingRental) {
            throw new ErrorHandler(404, "Rental not found");
        }

        const updatedRental = await rentModel.updateRentalStatus(id, status);
        
        res.json({
            success: true,
            message: "Rental status updated successfully",
            data: updatedRental
        });
    } catch (error) {
        next(error);
    }
};

export const cancelRental = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await prisma.$transaction(async (tx) => {
            // Find rental
            const rental = await rentModel.findRentalById(id);
            if (!rental) {
                throw new ErrorHandler(404, "Rental not found");
            }
            if (rental.status === 'completed') {
                throw new ErrorHandler(400, "Cannot cancel completed rental");
            }

            // Update rental status to cancelled
            await tx.rental.update({
                where: { id: parseInt(id) },
                data: { status: 'cancelled' }
            });

            // Make vehicle available again
            await tx.vehicle.update({
                where: { id: rental.vehicleId },
                data: { isAvailable: true }
            });

            // Cancel payment
            await tx.payment.updateMany({
                where: { rentalId: parseInt(id) },
                data: { status: 'failed' }
            });

            return rental;
        });

        res.json({
            success: true,
            message: "Rental cancelled successfully",
            data: result
        });

    } catch (error) {
        next(error);
    }
};

export const deleteRental = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if rental exists
        const existingRental = await rentModel.findRentalById(id);
        if (!existingRental) {
            throw new ErrorHandler(404, "Rental not found");
        }

        const result = await prisma.$transaction(async (tx) => {
            // Delete related payments first
            await tx.payment.deleteMany({
                where: { rentalId: parseInt(id) }
            });

            // Delete rental
            const deletedRental = await tx.rental.delete({
                where: { id: parseInt(id) }
            });

            // If rental was active, make vehicle available
            if (existingRental.status === 'booked' || existingRental.status === 'ongoing') {
                await tx.vehicle.update({
                    where: { id: existingRental.vehicleId },
                    data: { isAvailable: true }
                });
            }

            return deletedRental;
        });

        res.json({
            success: true,
            message: "Rental deleted successfully",
            data: result
        });

    } catch (error) {
        next(error);
    }
};

export const getRentalsByStatus = async (req, res, next) => {
    try {
        const { status } = req.params;
        const rentals = await rentModel.findRentalsByStatus(status);
        
        res.json({
            success: true,
            message: `Rentals with status '${status}' retrieved successfully`,
            data: rentals
        });
    } catch (error) {
        next(error);
    }
};

export const getRentalsByVehicleId = async (req, res, next) => {
    try {
        const { vehicleId } = req.params;
        
        const rentals = await prisma.rental.findMany({
            where: { vehicleId: parseInt(vehicleId) },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                vehicle: {
                    select: {
                        id: true,
                        name: true,
                        brand: true,
                        licensePlate: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        
        res.json({
            success: true,
            message: "Vehicle rentals retrieved successfully",
            data: rentals
        });
    } catch (error) {
        next(error);
    }
};
