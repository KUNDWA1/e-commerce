import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    req.body.userId = decoded.userId; // attach userId to request for controllers
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};
