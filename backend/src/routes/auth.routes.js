const router = require("express").Router();
const bcrypt = require("bcrypt");
const { Admin } = require("../models");
const {
  generateTokens,
  verifyRefreshToken,
  authenticateToken,
} = require("../middleware/auth.middleware");
const { body, validationResult } = require("express-validator");

// Admin login
router.post(
  "/admin/login",
  [body("email").isEmail().normalizeEmail(), body("password").notEmpty()],
  async (req, res) => {
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

      // Verify password
      const isValidPassword = await bcrypt.compare(
        password,
        admin.password_hash
      );
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(admin.id);

      res.json({
        success: true,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  }
);

// Refresh token
router.post("/admin/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token required" });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    // Find admin
    const admin = await Admin.findByPk(decoded.id);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Generate new tokens
    const tokens = generateTokens(admin.id);

    res.json({
      success: true,
      ...tokens,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ error: "Token refresh failed" });
  }
});

// Get current admin profile
router.get("/admin/profile", authenticateToken, async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.admin.id, {
      attributes: { exclude: ["password_hash"] },
    });

    res.json({
      success: true,
      admin,
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Failed to get profile" });
  }
});

// Logout (client-side token removal, but we can track it server-side if needed)
router.post("/admin/logout", authenticateToken, (req, res) => {
  // In a production app, you might want to blacklist the token
  res.json({ success: true, message: "Logged out successfully" });
});

module.exports = router;
