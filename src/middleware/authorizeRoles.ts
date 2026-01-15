// src/middleware/authorizeRoles.ts
import { Request, Response, NextFunction } from "express";

/**
 * Role-Based Access Control Middleware
 * Usage: authorizeRoles("admin"), authorizeRoles("admin", "vendor")
 */
export const authorizeRoles = (
  ...roles: Array<"admin" | "vendor" | "customer">
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

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
