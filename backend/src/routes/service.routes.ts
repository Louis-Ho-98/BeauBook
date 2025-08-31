import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

// Temporary model imports until we convert models to TypeScript
const { Service } = require("../models");

// Get all active services (public)
router.get("/", async (req: Request, res: Response) => {
  try {
    const services = await Service.findAll({
      where: { isActive: true },
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
router.get("/:id", async (req: Request, res: Response) => {
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
    body("duration").isInt({ min: 15, max: 480 }),
    body("price").isFloat({ min: 0 }),
    body("category").optional().trim(),
    body("description").optional().trim(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const service = await Service.create({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category || "General",
        duration: req.body.duration,
        price: req.body.price,
        isActive: true,
      });

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
    body("duration").optional().isInt({ min: 15, max: 480 }),
    body("price").optional().isFloat({ min: 0 }),
    body("category").optional().trim(),
    body("description").optional().trim(),
    body("isActive").optional().isBoolean(),
  ],
  async (req: Request, res: Response) => {
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
router.delete(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const service = await Service.findByPk(req.params.id);

      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }

      // Soft delete by setting isActive to false
      await service.update({ isActive: false });

      res.json({
        success: true,
        message: "Service deleted successfully",
      });
    } catch (error) {
      console.error("Delete service error:", error);
      res.status(500).json({ error: "Failed to delete service" });
    }
  }
);

export default router;
