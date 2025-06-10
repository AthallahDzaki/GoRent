import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import { generateToken } from "../utils/jwt.js";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) throw new Error("Email already registered");

        const hash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hash },
        });

        const token = await generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        res.json({
            status: true,
            message: "Registration successful",
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });
    } catch (err) {
        res.status(400).json({ status: "failed", errors: [err.message] });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new Error("email not found");
        if (!user.password) throw new Error("User has no password set");
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new Error("Wrong password");
        const token = await generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        res.json({
            status: true,
            message: "Login successful",
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });
    } catch (err) {
        res.status(400).json({ status: "failed", errors: [err.message] });
    }
};

export const logoutUser = async (req, res) => {
    try {
        console.log("Logging out user:", req.user);
        const user = req.user;
        if (!user) throw new Error("User not authenticated");
        // Clear user token in the database
        if (!user.id) throw new Error("User ID not found");
        await prisma.user.update({
            where: { id: user.id },
            data: { userToken: null },
        });
        req.user = null; // Clear user from request

        res.json({
            status: true,
            message: "Logged out successfully",
            data: null,
        });
    } catch (err) {
        res.status(400).json({ status: "failed", errors: [err.message] });
    }
};
