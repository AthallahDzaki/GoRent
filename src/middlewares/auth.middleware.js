import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { generateToken } from "../utils/jwt.js";

const SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Pastikan ini diatur di .env

export const isAuthenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1]; // Bearer <token>

    if (!token) return res.status(401).json({ status: "failed", errors: ["Unauthorized"] });

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded; // Simpan info user di req.user
        if (!req.user.id || !req.user.email || !req.user.role) {
            return res.status(401).json({ status: "failed", errors: ["Invalid token payload"] });
        }
        // Check if user exists in the database with the token
        if (!req.user.id) {
            return res.status(401).json({ status: "failed", errors: ["Unauthorized token invalid"] });
        }
        // Validate user with token in the database
        const user = await prisma.user.findUnique({
            where: { id: req.user.id, userToken: token },
        });
        if (!user) {
            return res.status(401).json({ status: "failed", errors: ["Unauthorized token invalid"] });
        }
        // If token is valid, proceed to the next middleware
        res.setHeader("Authorization", `Bearer ${token}`); // Set token di header
        req.user.token = token; // Simpan token di req.user untuk digunakan di middleware lain
        next();
    } catch (err) {
        return res.status(401).json({ status: "failed", errors: ["Unauthorized"] });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ status: "failed", errors: ["Forbidden"] });
    }
    next();
};
