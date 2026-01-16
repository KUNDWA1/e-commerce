"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const JWT_SECRET = process.env.JWT_SECRET || "secret123";
/**
 * AUTHENTICATION
 * Checks if user is logged in
 */
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await User_1.default.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        // attach user to request
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Token invalid or expired" });
    }
};
exports.protect = protect;
/**
 * AUTHORIZATION (RBAC)
 * Restricts access based on roles
 */
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        if (!roles.includes(user.role)) {
            return res.status(403).json({
                message: `Access denied. Role '${user.role}' is not allowed`,
            });
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
//# sourceMappingURL=auth.middleware.js.map