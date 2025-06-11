import * as vehicleModel from "../models/vehicle.models.js";
import * as rentModel from "../models/rent.models.js";
import * as paymentModel from "../models/payment.models.js";
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
            if (!vehicle.isAvailable || vehicle.status !== "available") {
                throw new ErrorHandler(400, "Vehicle is not available for rent");
            }

            // Calculate total price
            const days = Math.ceil(
                (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
            );
            const totalPrice = days * vehicle.pricePerDay;

            // Create rental
            const rental = await tx.rental.create({
                data: {
                    userId,
                    vehicleId: parseInt(vehicleId),
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    totalPrice,
                    status: "booked",
                },
            });

            // Update vehicle availability
            await tx.vehicle.update({
                where: { id: parseInt(vehicleId) },
                data: { isAvailable: false, status: "booked" },
            });

            // Create payment record
            const payment = await tx.payment.create({
                data: {
                    rentalId: rental.id,
                    method: paymentMethod || "credit_card",
                    amount: totalPrice,
                    status: "pending",
                },
            });

            payment.callbackUrl = `${process.env.APP_URL}/api/payments/callback`;

            return { rental, payment };
        });

        res.json({
            success: true,
            message: "Vehicle rented successfully",
            data: {
                rental: result.rental,
                payment: result.payment,
            },
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
            if (rental.status === "completed") {
                throw new ErrorHandler(400, "Vehicle already returned");
            }

            // Check payment status
            const payment = await paymentModel.findPaymentByRentalId(rentalId);
            if (!payment || payment.status !== "completed") {
                throw new ErrorHandler(400, "Payment not completed for this rental");
            }

            // Update rental status
            const updatedRental = await tx.rental.update({
                where: { id: parseInt(rentalId) },
                data: { status: "completed" },
            });

            // Update vehicle availability
            const updatedVehicle = await tx.vehicle.update({
                where: { id: rental.vehicleId },
                data: { isAvailable: true, status: "available" },
            });

            return { rental: updatedRental, vehicle: updatedVehicle };
        });

        res.json({
            success: true,
            message: "Vehicle returned successfully",
            data: result,
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
            data: rentals,
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
            data: rental,
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
            data: rentals,
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
            data: rentals,
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
            data: updatedRental,
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
            data: updatedRental,
        });
    } catch (error) {
        next(error);
    }
};

export const cancelRental = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = rentModel.updateRentalStatus(id, "cancelled");
        if (!result) {
            throw new ErrorHandler(404, "Rental not found");
        }
        // If rental was active, make vehicle available
        const existingRental = await rentModel.findRentalById(id);
        if (existingRental.status === "booked" || existingRental.status === "ongoing") {
            vehicleModel.updateVehicle(existingRental.vehicleId, { isAvailable: true, status: "available" });
        }

        const payment = await paymentModel.findPaymentById(existingRental.paymentId);
        if (payment && payment.status === "pending") {
            await paymentModel.updatePayment(payment.id, { status: "cancelled" });
        }

        res.json({
            success: true,
            message: "Rental cancelled successfully",
            data: result,
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
            data: rentals,
        });
    } catch (error) {
        next(error);
    }
};

export const getRentalsByVehicleId = async (req, res, next) => {
    try {
        const { vehicleId } = req.params;

        const rentals = await rentModel.findRentalsByVehicleId(vehicleId);
        if (!rentals || rentals.length === 0) {
            throw new ErrorHandler(404, "No rentals found for this vehicle");
        }

        res.json({
            success: true,
            message: "Vehicle rentals retrieved successfully",
            data: rentals,
        });
    } catch (error) {
        next(error);
    }
};
