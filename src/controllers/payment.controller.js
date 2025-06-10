import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Handle payment callback from payment gateway
export const paymentCallback = async (req, res) => {
    try {
        const {
            id, // Transaction ID dari Payment
            external_id, // ID dari aplikasi kita
            reference_id, // Untuk e-wallet
            status,
            amount,
            paid_amount,
            capture_amount,
            payment_method,
            channel_code,
            bank_code,
        } = req.body;

        // Determine the actual values based on payment type
        const transactionId = id; // Payment's transaction ID
        const ourReferenceId = external_id || reference_id; // Our reference
        const paymentAmount = paid_amount || capture_amount || amount;
        const paymentStatus = status;
        const method = payment_method || channel_code || bank_code || "unknown";

        console.log("Payment callback received:", req.body);

        // Validate required fields
        if (!transactionId || !paymentStatus || !paymentAmount) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields from payment callback",
            });
        }

        // Find payment by amount and method (or by reference if you store it)
        const payment = await prisma.payment.findFirst({
            where: {
                amount: paymentAmount,
                status: "pending",
                // Jika Anda menyimpan reference_id di database:
                id: parseInt(ourReferenceId), // Gunakan external_id atau reference_id sesuai kebutuhan
            },
            include: {
                rental: {
                    include: {
                        user: true,
                        vehicle: true,
                    },
                },
            },
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found",
            });
        }

        // Map Payment status to our status
        let paymentStatus_internal = "pending";
        let rentalStatus = payment.rental.status;

        switch (paymentStatus.toUpperCase()) {
            case "PAID":
            case "SUCCEEDED":
            case "COMPLETED":
                paymentStatus_internal = "completed";
                rentalStatus = "ongoing";
                break;
            case "EXPIRED":
            case "FAILED":
            case "CANCELLED":
                paymentStatus_internal = "failed";
                rentalStatus = "cancelled";
                break;
            case "PENDING":
                paymentStatus_internal = "pending";
                break;
            default:
                paymentStatus_internal = "failed";
                rentalStatus = "cancelled";
        }

        // Use transaction to update both payment and rental
        const result = await prisma.$transaction(async (tx) => {
            // Update payment with Payment transaction ID
            const updatedPayment = await tx.payment.update({
                where: { id: payment.id },
                data: {
                    status: paymentStatus_internal,
                    paidAt: paymentStatus_internal === "completed" ? new Date() : null,
                },
            });

            // Update rental status
            const updatedRental = await tx.rental.update({
                where: { id: payment.rentalId },
                data: { status: rentalStatus },
            });

            // If payment failed, make vehicle available again
            if (paymentStatus_internal === "failed") {
                await tx.vehicle.update({
                    where: { id: payment.rental.vehicleId },
                    data: { isAvailable: true },
                });
            }

            return { payment: updatedPayment, rental: updatedRental };
        });

        // Send notification to user
        await sendPaymentNotification(payment.rental.userId, {
            rentalId: payment.rentalId,
            status: paymentStatus_internal,
            vehicleName: payment.rental.vehicle.name,
            amount: payment.amount,
            transactionId: transactionId,
        });
        return res.status(200).json({
            success: true,
            message: "Callback processed successfully",
        });
    } catch (error) {
        console.error("Gateway callback error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            errors: [error.message],
        });
    }
};

// Send payment notification
const sendPaymentNotification = async (userId, paymentData) => {
    console.log(`Sending payment notification to user ${userId}:`, paymentData);

    switch (paymentData.status) {
        case "completed":
            console.log(
                `✅ Payment successful for ${paymentData.vehicleName} - Amount: ${paymentData.amount}`
            );
            break;
        case "failed":
            console.log(
                `❌ Payment failed for ${paymentData.vehicleName} - Amount: ${paymentData.amount}`
            );
            break;
        default:
            console.log(`⏳ Payment status: ${paymentData.status} for ${paymentData.vehicleName}`);
    }
};
