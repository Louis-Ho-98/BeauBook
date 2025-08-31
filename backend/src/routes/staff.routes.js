const router = require("express").Router();
const { Staff, StaffSchedule, StaffBreak, Service } = require("../models");
const { authenticateToken } = require("../middleware/auth.middleware");
const { body, validationResult } = require("express-validator");

// Get all active staff (public)
router.get("/", async (req, res) => {
  try {
    const staff = await Staff.findAll({
      where: { is_active: true },
      include: [
        {
          model: StaffSchedule,
          as: "schedules",
          where: { is_active: true },
          required: false,
        },
      ],
      order: [["name", "ASC"]],
    });

    res.json({
      success: true,
      staff,
    });
  } catch (error) {
    console.error("Get staff error:", error);
    res.status(500).json({ error: "Failed to get staff" });
  }
});

// Get single staff member with schedule (public)
router.get("/:id", async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id, {
      include: [
        {
          model: StaffSchedule,
          as: "schedules",
          where: { is_active: true },
          required: false,
        },
        {
          model: StaffBreak,
          as: "breaks",
          required: false,
        },
      ],
    });

    if (!staff) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    res.json({
      success: true,
      staff,
    });
  } catch (error) {
    console.error("Get staff error:", error);
    res.status(500).json({ error: "Failed to get staff member" });
  }
});

// Get staff services (public)
router.get("/:id/services", async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id);

    if (!staff) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    // Get services based on staff specialties
    const services = await Service.findAll({
      where: {
        id: staff.specialties,
        is_active: true,
      },
    });

    res.json({
      success: true,
      services,
    });
  } catch (error) {
    console.error("Get staff services error:", error);
    res.status(500).json({ error: "Failed to get staff services" });
  }
});

// Create new staff member (admin only)
router.post(
  "/",
  authenticateToken,
  [
    body("name").notEmpty().trim(),
    body("email").optional().isEmail().normalizeEmail(),
    body("phone").optional().trim(),
    body("specialties").optional().isArray(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const staff = await Staff.create(req.body);

      res.status(201).json({
        success: true,
        staff,
      });
    } catch (error) {
      console.error("Create staff error:", error);
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({ error: "Email already exists" });
      }
      res.status(500).json({ error: "Failed to create staff member" });
    }
  }
);

// Update staff member (admin only)
router.put(
  "/:id",
  authenticateToken,
  [
    body("name").optional().notEmpty().trim(),
    body("email").optional().isEmail().normalizeEmail(),
    body("phone").optional().trim(),
    body("specialties").optional().isArray(),
    body("is_active").optional().isBoolean(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const staff = await Staff.findByPk(req.params.id);

      if (!staff) {
        return res.status(404).json({ error: "Staff member not found" });
      }

      await staff.update(req.body);

      res.json({
        success: true,
        staff,
      });
    } catch (error) {
      console.error("Update staff error:", error);
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({ error: "Email already exists" });
      }
      res.status(500).json({ error: "Failed to update staff member" });
    }
  }
);

// Delete staff member (admin only - soft delete)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id);

    if (!staff) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    // Soft delete by setting is_active to false
    await staff.update({ is_active: false });

    res.json({
      success: true,
      message: "Staff member deleted successfully",
    });
  } catch (error) {
    console.error("Delete staff error:", error);
    res.status(500).json({ error: "Failed to delete staff member" });
  }
});

// Update staff schedule (admin only)
router.put("/:id/schedule", authenticateToken, async (req, res) => {
  try {
    const { schedules } = req.body;
    const staffId = req.params.id;

    // Verify staff exists
    const staff = await Staff.findByPk(staffId);
    if (!staff) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    // Delete existing schedules
    await StaffSchedule.destroy({
      where: { staff_id: staffId },
    });

    // Create new schedules
    if (schedules && schedules.length > 0) {
      const scheduleData = schedules.map((schedule) => ({
        ...schedule,
        staff_id: staffId,
      }));
      await StaffSchedule.bulkCreate(scheduleData);
    }

    // Get updated schedules
    const updatedSchedules = await StaffSchedule.findAll({
      where: { staff_id: staffId },
    });

    res.json({
      success: true,
      schedules: updatedSchedules,
    });
  } catch (error) {
    console.error("Update schedule error:", error);
    res.status(500).json({ error: "Failed to update schedule" });
  }
});

// Update staff breaks (admin only)
router.put("/:id/breaks", authenticateToken, async (req, res) => {
  try {
    const { breaks } = req.body;
    const staffId = req.params.id;

    // Verify staff exists
    const staff = await Staff.findByPk(staffId);
    if (!staff) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    // Delete existing breaks
    await StaffBreak.destroy({
      where: { staff_id: staffId },
    });

    // Create new breaks
    if (breaks && breaks.length > 0) {
      const breakData = breaks.map((breakItem) => ({
        ...breakItem,
        staff_id: staffId,
      }));
      await StaffBreak.bulkCreate(breakData);
    }

    // Get updated breaks
    const updatedBreaks = await StaffBreak.findAll({
      where: { staff_id: staffId },
    });

    res.json({
      success: true,
      breaks: updatedBreaks,
    });
  } catch (error) {
    console.error("Update breaks error:", error);
    res.status(500).json({ error: "Failed to update breaks" });
  }
});

module.exports = router;
