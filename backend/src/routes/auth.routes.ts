import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { AuthRequest } from "../types";
import {
  authenticateToken,
  generateTokens,
} from "../middleware/auth.middleware";

const router = Router();

// Temporary admin model until we convert models
const Admin = require("../models").Admin;

// Validation middleware
const validateLogin = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
];

// Admin login
router.post(
  "/admin/login",
  validateLogin,
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find admin by email
      const admin = await Admin.findOne({ where: { email } });
      if (!admin) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(
        password,
        admin.password_hash
      );
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Check if admin is active
      if (!admin.is_active) {
        return res.status(403).json({ error: "Account is deactivated" });
      }

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(admin.id);

      // Update last login
      await admin.update({ lastLogin: new Date() });

      res.json({
        success: true,
        accessToken,
        refreshToken,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  }
);

// Get admin profile
router.get(
  "/admin/profile",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const admin = await Admin.findByPk(req.user.id, {
        attributes: { exclude: ["password"] },
      });

      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }

      res.json({ admin });
    } catch (error) {
      console.error("Profile error:", error);
      res.status(500).json({ error: "Failed to get profile" });
    }
  }
);

// Refresh token
router.post("/admin/refresh", async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token required" });
    }

    // For now, we'll just generate new tokens
    // In production, you should verify the refresh token
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(1); // Placeholder ID

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ error: "Failed to refresh token" });
  }
});

// Admin logout
router.post(
  "/admin/logout",
  authenticateToken,
  async (req: Request, res: Response) => {
    // In a production app, you might want to blacklist the token here
    res.json({ success: true, message: "Logged out successfully" });
  }
);

// Change password
router.put(
  "/admin/change-password",
  authenticateToken,
  [
    body("current_password").isLength({ min: 6 }),
    body("new_password")
      .isLength({ min: 8 })
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
      )
      .withMessage(
        "Password must contain uppercase, lowercase, number and special character"
      ),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { current_password, new_password } = req.body;

      // Get admin with password
      const admin = await Admin.findByPk(req.user.id);
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(
        current_password,
        admin.password
      );
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(new_password, 10);

      // Update password
      await admin.update({ password: hashedPassword });

      res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ error: "Failed to change password" });
    }
  }
);

export default router;
