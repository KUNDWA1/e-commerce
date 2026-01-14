// src/controllers/authController.ts

import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// -------------------- Helper: generate JWT --------------------
const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1d" });
};

// -------------------- Register --------------------
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, role });

    const token = generateToken(user._id.toString());
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error });
  }
};

// -------------------- Login --------------------
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id.toString());
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};

// -------------------- Get Profile --------------------
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId).select("-password -resetPasswordToken -resetPasswordExpires");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to get profile", error });
  }
};

// -------------------- Change Password --------------------
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to change password", error });
  }
};

// -------------------- Forgot Password --------------------
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now
    await user.save();

    // In real project, send email with resetToken link
    res.status(200).json({ message: "Reset token generated", resetToken });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate reset token", error });
  }
};

// -------------------- Reset Password --------------------
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

        const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    } as any);


    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to reset password", error });
  }
};

// -------------------- Logout --------------------
// Usually handled client-side by deleting JWT, but optional server-side blacklisting
export const logout = async (req: Request, res: Response) => {
  // Just tell client to remove token
  res.status(200).json({ message: "Logged out successfully" });
};
