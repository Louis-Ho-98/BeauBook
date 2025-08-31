const router = require("express").Router();
const { Service } = require("../models");
const { authenticateToken } = require("../middleware/auth.middleware");
const { body, validationResult } = require("express-validator");

// Get all active services (public)
router.get("/", async (req, res) => {
  try {
    const services = await Service.findAll({
      where: { is_active: true },
      order: [
        ["category", "ASC"],
        ["name", "ASC"],
      ],
    });

    res.json({
      success: true,
      services,
    });
  } catch (error) {
    console.error("Get services error:", error);
    res.status(500).json({ error: "Failed to get services" });
  }
});

// Get single service (public)
router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    res.json({
      success: true,
      service,
    });
  } catch (error) {
    console.error("Get service error:", error);
    res.status(500).json({ error: "Failed to get service" });
  }
});

// Create new service (admin only)
router.post(
  "/",
  authenticateToken,
  [
    body("name").notEmpty().trim(),
    body("duration_minutes").isInt({ min: 15, max: 480 }),
    body("price").isFloat({ min: 0 }),
    body("category").optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const service = await Service.create(req.body);

      res.status(201).json({
        success: true,
        service,
      });
    } catch (error) {
      console.error("Create service error:", error);
      res.status(500).json({ error: "Failed to create service" });
    }
  }
);

// Update service (admin only)
router.put(
  "/:id",
  authenticateToken,
  [
    body("name").optional().notEmpty().trim(),
    body("duration_minutes").optional().isInt({ min: 15, max: 480 }),
    body("price").optional().isFloat({ min: 0 }),
    body("category").optional().trim(),
    body("is_active").optional().isBoolean(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const service = await Service.findByPk(req.params.id);

      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }

      await service.update(req.body);

      res.json({
        success: true,
        service,
      });
    } catch (error) {
      console.error("Update service error:", error);
      res.status(500).json({ error: "Failed to update service" });
    }
  }
);

// Delete service (admin only - soft delete)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    // Soft delete by setting is_active to false
    await service.update({ is_active: false });

    res.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Delete service error:", error);
    res.status(500).json({ error: "Failed to delete service" });
  }
});

module.exports = router;
