// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

/**
 * AUTHENTICATION
 * Checks if user is logged in
 */
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // attach user to request
    (req as any).user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

/**
 * AUTHORIZATION (RBAC)
 * Restricts access based on roles
 */
export const authorizeRoles = (...roles: Array<"admin" | "vendor" | "customer">) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

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
