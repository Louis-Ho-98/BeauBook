const router = require("express").Router();
const bcrypt = require("bcrypt");
const { Admin, BusinessSettings } = require("../models");
const { authenticateToken } = require("../middleware/auth.middleware");
const { body, validationResult } = require("express-validator");

// All admin routes require authentication
router.use(authenticateToken);

// Get all admins
router.get("/admins", async (req, res) => {
  try {
    const admins = await Admin.findAll({
      attributes: { exclude: ["password_hash"] },
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
  async (req, res) => {
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
      const password_hash = await bcrypt.hash(password, 10);

      // Create admin
      const admin = await Admin.create({
        email,
        password_hash,
        name,
        role,
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
  async (req, res) => {
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

// Change password
router.put(
  "/change-password",
  [
    body("current_password").notEmpty(),
    body("new_password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { current_password, new_password } = req.body;
      const adminId = req.admin.id;

      // Get admin with password
      const admin = await Admin.findByPk(adminId);

      // Verify current password
      const isValidPassword = await bcrypt.compare(
        current_password,
        admin.password_hash
      );
      if (!isValidPassword) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      // Hash new password
      const password_hash = await bcrypt.hash(new_password, 10);
      await admin.update({ password_hash });

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ error: "Failed to change password" });
    }
  }
);

// Delete admin
router.delete("/admins/:id", async (req, res) => {
  try {
    // Prevent self-deletion
    if (req.admin.id === req.params.id) {
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
router.get("/settings", async (req, res) => {
  try {
    let settings = await BusinessSettings.findOne();

    // Create default settings if none exist
    if (!settings) {
      settings = await BusinessSettings.create({
        business_name: process.env.BUSINESS_NAME || "BeauBook Salon",
        business_email: process.env.BUSINESS_EMAIL || "info@beaubook.com",
        business_phone: process.env.BUSINESS_PHONE || "(555) 123-4567",
        business_address:
          process.env.BUSINESS_ADDRESS || "123 Beauty Lane, Vancouver, BC",
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
    body("business_name").optional().notEmpty().trim(),
    body("business_email").optional().isEmail().normalizeEmail(),
    body("business_phone").optional().trim(),
    body("business_address").optional().trim(),
    body("opening_time")
      .optional()
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    body("closing_time")
      .optional()
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    body("booking_buffer_minutes").optional().isInt({ min: 0, max: 120 }),
    body("max_advance_booking_days").optional().isInt({ min: 1, max: 365 }),
  ],
  async (req, res) => {
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

module.exports = router;
