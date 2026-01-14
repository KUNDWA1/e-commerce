import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);

    // Find user and attach to req
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    (req as any).user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};
