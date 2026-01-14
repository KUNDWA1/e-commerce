import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (userId: string) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || "secret123",
    { expiresIn: "1d" }
  );
};

// Register user
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    const token = generateToken(user._id.toString());
    res.status(201).json({ 
      id: user._id,
      name: user.name,
      email: user.email,
      token
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id.toString());
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};
