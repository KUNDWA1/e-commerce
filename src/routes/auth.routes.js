"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.routes.ts
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Public routes
router.post("/register", authController_1.register);
router.post("/login", authController_1.login);
router.post("/forgot-password", authController_1.forgotPassword);
router.put("/reset-password/:token", authController_1.resetPassword);
// Protected routes
router.get("/me", auth_middleware_1.protect, authController_1.getProfile);
router.post("/logout", auth_middleware_1.protect, authController_1.logout);
router.put("/change-password", auth_middleware_1.protect, authController_1.changePassword);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map