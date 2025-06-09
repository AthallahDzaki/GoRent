import prisma from "../lib/prisma.js";

export const findAllPayments = async () => {
    return await prisma.payment.findMany();
}

export const findPaymentById = async (id) => {
    return await prisma.payment.findUnique({
        where: { id },
    });
};

export const createPayment = async (data) => {
    return await prisma.payment.create({
        data,
    });
};

export const updatePayment = async (id, data) => {
    return await prisma.payment.update({
        where: { id },
        data,
    });
};

export const deletePayment = async (id) => {
    return await prisma.payment.delete({
        where: { id },
    });
};