"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = void 0;
/**
 * Role-Based Access Control Middleware
 * Usage: authorizeRoles("admin"), authorizeRoles("admin", "vendor")
 */
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                message: "Not authenticated",
            });
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
//# sourceMappingURL=authorizeRoles.js.map