import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

// Temporary model imports until we convert models to TypeScript
const { Staff, StaffSchedule, StaffBreak, Service } = require("../models");

// Get all active staff (public)
router.get("/", async (req: Request, res: Response) => {
  try {
    const staff = await Staff.findAll({
      where: { isActive: true },
      include: [
        {
          model: StaffSchedule,
          as: "schedules",
          where: { isAvailable: true },
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
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const staff = await Staff.findByPk(req.params.id, {
      include: [
        {
          model: StaffSchedule,
          as: "schedules",
          where: { isAvailable: true },
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
router.get("/:id/services", async (req: Request, res: Response) => {
  try {
    const staff = await Staff.findByPk(req.params.id);

    if (!staff) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    // Get services based on staff specialties
    let services = [];
    if (staff.specialties && staff.specialties.length > 0) {
      // If specialties contains service IDs
      services = await Service.findAll({
        where: {
          isActive: true,
        },
      });

      // Filter services that match staff specialties (by name or category)
      services = services.filter((service: any) =>
        staff.specialties.some(
          (specialty: string) =>
            service.name.toLowerCase().includes(specialty.toLowerCase()) ||
            service.category?.toLowerCase() === specialty.toLowerCase()
        )
      );
    } else {
      // Return all active services if no specialties defined
      services = await Service.findAll({
        where: { isActive: true },
      });
    }

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
    body("bio").optional().trim(),
    body("specialties").optional().isArray(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const staff = await Staff.create({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        bio: req.body.bio,
        specialties: req.body.specialties || [],
        isActive: true,
      });

      res.status(201).json({
        success: true,
        staff,
      });
    } catch (error: any) {
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
    body("bio").optional().trim(),
    body("specialties").optional().isArray(),
    body("isActive").optional().isBoolean(),
  ],
  async (req: Request, res: Response) => {
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
    } catch (error: any) {
      console.error("Update staff error:", error);
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({ error: "Email already exists" });
      }
      res.status(500).json({ error: "Failed to update staff member" });
    }
  }
);

// Delete staff member (admin only - soft delete)
router.delete(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const staff = await Staff.findByPk(req.params.id);

      if (!staff) {
        return res.status(404).json({ error: "Staff member not found" });
      }

      // Soft delete by setting isActive to false
      await staff.update({ isActive: false });

      res.json({
        success: true,
        message: "Staff member deleted successfully",
      });
    } catch (error) {
      console.error("Delete staff error:", error);
      res.status(500).json({ error: "Failed to delete staff member" });
    }
  }
);

// Update staff schedule (admin only)
router.put(
  "/:id/schedule",
  authenticateToken,
  async (req: Request, res: Response) => {
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
        where: { staffId },
      });

      // Create new schedules
      if (schedules && schedules.length > 0) {
        const scheduleData = schedules.map((schedule: any) => ({
          ...schedule,
          staffId,
        }));
        await StaffSchedule.bulkCreate(scheduleData);
      }

      // Get updated schedules
      const updatedSchedules = await StaffSchedule.findAll({
        where: { staffId },
      });

      res.json({
        success: true,
        schedules: updatedSchedules,
      });
    } catch (error) {
      console.error("Update schedule error:", error);
      res.status(500).json({ error: "Failed to update schedule" });
    }
  }
);

// Update staff breaks (admin only)
router.put(
  "/:id/breaks",
  authenticateToken,
  async (req: Request, res: Response) => {
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
        where: { staffId },
      });

      // Create new breaks
      if (breaks && breaks.length > 0) {
        const breakData = breaks.map((breakItem: any) => ({
          ...breakItem,
          staffId,
        }));
        await StaffBreak.bulkCreate(breakData);
      }

      // Get updated breaks
      const updatedBreaks = await StaffBreak.findAll({
        where: { staffId },
      });

      res.json({
        success: true,
        breaks: updatedBreaks,
      });
    } catch (error) {
      console.error("Update breaks error:", error);
      res.status(500).json({ error: "Failed to update breaks" });
    }
  }
);

export default router;
