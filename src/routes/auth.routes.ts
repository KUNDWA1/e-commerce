// src/routes/auth.routes.ts
import express from "express";
import {
  register,
  login,
  logout,
  getProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";
import { protect } from "../middleware/auth.middleware";


const router = express.Router();

// Public routes



router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// Protected routes
router.get("/me", protect, getProfile);
router.post("/logout", protect, logout);
router.put("/change-password", protect, changePassword);

export default router;


