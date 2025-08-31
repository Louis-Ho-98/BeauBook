import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";
import { AuthRequest } from "../types";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

// Temporary model imports until we convert models to TypeScript
const { Admin, BusinessSettings } = require("../models");

// All admin routes require authentication
router.use(authenticateToken);

// Get all admins
router.get("/admins", async (req: Request, res: Response) => {
  try {
    const admins = await Admin.findAll({
      attributes: { exclude: ["password"] },
    });

    res.json({
      success: true,
      admins,
    });
  } catch (error) {
    console.error("Get admins error:", error);
    res.status(500).json({ error: "Failed to get admins" });
  }
});

// Create new admin
router.post(
  "/admins",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("name").notEmpty().trim(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name, role = "admin" } = req.body;

      // Check if admin exists
      const existingAdmin = await Admin.findOne({ where: { email } });
      if (existingAdmin) {
        return res
          .status(400)
          .json({ error: "Admin with this email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create admin
      const admin = await Admin.create({
        email,
        password: hashedPassword,
        name,
        role,
        isActive: true,
      });

      res.status(201).json({
        success: true,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      });
    } catch (error) {
      console.error("Create admin error:", error);
      res.status(500).json({ error: "Failed to create admin" });
    }
  }
);

// Update admin
router.put(
  "/admins/:id",
  [
    body("email").optional().isEmail().normalizeEmail(),
    body("name").optional().notEmpty().trim(),
    body("role").optional().isIn(["admin", "super_admin"]),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const admin = await Admin.findByPk(req.params.id);
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }

      await admin.update(req.body);

      res.json({
        success: true,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      });
    } catch (error) {
      console.error("Update admin error:", error);
      res.status(500).json({ error: "Failed to update admin" });
    }
  }
);

// Delete admin
router.delete("/admins/:id", async (req: AuthRequest, res: Response) => {
  try {
    // Prevent self-deletion
    if (req.user?.id === parseInt(req.params.id)) {
      return res.status(400).json({ error: "Cannot delete your own account" });
    }

    const admin = await Admin.findByPk(req.params.id);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    await admin.destroy();

    res.json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    console.error("Delete admin error:", error);
    res.status(500).json({ error: "Failed to delete admin" });
  }
});

// Get business settings
router.get("/settings", async (req: Request, res: Response) => {
  try {
    let settings = await BusinessSettings.findOne();

    // Create default settings if none exist
    if (!settings) {
      settings = await BusinessSettings.create({
        businessName: process.env.BUSINESS_NAME || "BeauBook Salon",
        email: process.env.BUSINESS_EMAIL || "info@beaubook.com",
        phone: process.env.BUSINESS_PHONE || "(555) 123-4567",
        address:
          process.env.BUSINESS_ADDRESS || "123 Beauty Lane, Vancouver, BC",
        timezone: "America/Vancouver",
        currency: "CAD",
        bookingLeadTime: 2,
        maxAdvanceBooking: 60,
        cancellationPolicy:
          "Cancellations must be made at least 24 hours in advance.",
      });
    }

    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({ error: "Failed to get settings" });
  }
});

// Update business settings
router.put(
  "/settings",
  [
    body("businessName").optional().notEmpty().trim(),
    body("email").optional().isEmail().normalizeEmail(),
    body("phone").optional().trim(),
    body("address").optional().trim(),
    body("timezone").optional().trim(),
    body("currency").optional().trim(),
    body("bookingLeadTime").optional().isInt({ min: 0, max: 48 }),
    body("maxAdvanceBooking").optional().isInt({ min: 1, max: 365 }),
    body("cancellationPolicy").optional().trim(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      let settings = await BusinessSettings.findOne();

      if (!settings) {
        settings = await BusinessSettings.create(req.body);
      } else {
        await settings.update(req.body);
      }

      res.json({
        success: true,
        settings,
      });
    } catch (error) {
      console.error("Update settings error:", error);
      res.status(500).json({ error: "Failed to update settings" });
    }
  }
);

export default router;
