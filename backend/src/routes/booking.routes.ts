import { Router, Request, Response } from "express";
import { Op } from "sequelize";
import { body, validationResult } from "express-validator";
import { AuthRequest } from "../types";
import { authenticateToken } from "../middleware/auth.middleware";
import { getDay } from "@/utils/datetimeHelper";

const router = Router();

// Temporary model imports until we convert models to TypeScript
const {
  Booking,
  Staff,
  Service,
  StaffSchedule,
  StaffBreak,
} = require("../models");

// Helper function to calculate available time slots
const calculateAvailability = (
  schedule: any,
  breaks: any[],
  bookings: any[],
  serviceDuration: number
): Array<{ time: string; available: boolean }> => {
  const slots: Array<{ time: string; available: boolean }> = [];

  if (!schedule) return slots;

  const [startHour, startMin] = schedule.start_time.split(":").map(Number);
  const [endHour, endMin] = schedule.end_time.split(":").map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  // Generate 30-minute slots
  for (
    let time = startMinutes;
    time <= endMinutes - serviceDuration;
    time += 30
  ) {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    const timeStr = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    // Check if slot conflicts with breaks or existing bookings
    let isAvailable = true;

    // Check breaks
    for (const breakItem of breaks) {
      const [breakStartH, breakStartM] = breakItem.startTime
        .split(":")
        .map(Number);
      const [breakEndH, breakEndM] = breakItem.endTime.split(":").map(Number);
      const breakStart = breakStartH * 60 + breakStartM;
      const breakEnd = breakEndH * 60 + breakEndM;

      if (time < breakEnd && time + serviceDuration > breakStart) {
        isAvailable = false;
        break;
      }
    }

    // Check existing bookings
    if (isAvailable) {
      for (const booking of bookings) {
        const [bookingStartH, bookingStartM] = booking.start_time
          .split(":")
          .map(Number);
        const [bookingEndH, bookingEndM] = booking.end_time
          .split(":")
          .map(Number);
        const bookingStart = bookingStartH * 60 + bookingStartM;
        const bookingEnd = bookingEndH * 60 + bookingEndM;

        if (time < bookingEnd && time + serviceDuration > bookingStart) {
          isAvailable = false;
          break;
        }
      }
    }

    slots.push({ time: timeStr, available: isAvailable });
  }

  return slots;
};

// Get available time slots (public)
router.post(
  "/availability",
  [
    body("staff_id").notEmpty(),
    body("service_id").notEmpty(),
    body("date").notEmpty().isISO8601(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { staff_id, service_id, date } = req.body;

      // Get service duration
      const service = await Service.findByPk(service_id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }

      // Get staff schedule for the day

      const dayOfWeek = getDay(date);
      const schedule = await StaffSchedule.findOne({
        where: {
          staff_id,
          day_of_week: dayOfWeek,
          is_active: true,
        },
      });

      console.log("Schedule: ", schedule);

      if (!schedule) {
        return res.json({ success: true, slots: [] });
      }

      // Get breaks for the day
      const breaks = await StaffBreak.findAll({
        where: {
          staff_id,
          [Op.or]: [
            { day_of_week: dayOfWeek },
            { break_date: date, is_recurring: false },
          ],
        },
      });

      // Get existing bookings for the day
      const bookings = await Booking.findAll({
        where: {
          staff_id,
          booking_date: date,
          status: { [Op.ne]: "cancelled" },
        },
      });

      // Calculate available slots
      const slots = calculateAvailability(
        schedule,
        breaks,
        bookings,
        service.duration || 30
      );

      res.json({
        success: true,
        slots,
      });
    } catch (error) {
      console.error("Get availability error:", error);
      res.status(500).json({ error: "Failed to get availability" });
    }
  }
);

// Create new booking (public)
router.post(
  "/",
  [
    body("customer_name").notEmpty().trim(),
    body("customer_email").isEmail().normalizeEmail(),
    body("customer_phone").notEmpty().trim(),
    body("staff_id").notEmpty(),
    body("service_id").notEmpty(),
    body("booking_date").notEmpty().isISO8601(),
    body("start_time")
      .notEmpty()
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    body("notes").optional().trim(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        customer_name,
        customer_email,
        customer_phone,
        staff_id,
        service_id,
        booking_date,
        start_time,
        notes,
      } = req.body;

      // Get service to calculate end time
      const service = await Service.findByPk(service_id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }

      // Calculate end time
      const [hours, minutes] = start_time.split(":").map(Number);
      const startMinutes = hours * 60 + minutes;
      const endMinutes = startMinutes + (service.duration || 30);
      const endHours = Math.floor(endMinutes / 60);
      const endMins = endMinutes % 60;
      const end_time = `${endHours.toString().padStart(2, "0")}:${endMins
        .toString()
        .padStart(2, "0")}`;

      // Check for conflicts
      const conflict = await Booking.findOne({
        where: {
          staff_id,
          booking_date,
          status: { [Op.ne]: "cancelled" },
          [Op.or]: [
            {
              start_time: { [Op.lt]: end_time },
              end_time: { [Op.gt]: start_time },
            },
          ],
        },
      });

      if (conflict) {
        return res.status(400).json({ error: "Time slot is not available" });
      }

      // Generate confirmation code
      const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
      const booking_ref = `BK-${date}-${random}`;

      // Create booking
      const booking = await Booking.create({
        customer_name,
        customer_email,
        customer_phone,
        staff_id,
        service_id,
        booking_date,
        start_time,
        end_time,
        notes,
        status: "confirmed",
        booking_ref,
        price: service.price,
        duration: service.duration || 30,
      });

      // Load complete booking with associations
      const completeBooking = await Booking.findByPk(booking.id, {
        include: [
          { model: Staff, as: "staff" },
          { model: Service, as: "service" },
        ],
      });

      res.status(201).json({
        success: true,
        booking: completeBooking,
      });
    } catch (error) {
      console.error("Create booking error:", error);
      res.status(500).json({ error: "Failed to create booking" });
    }
  }
);

// Get booking by reference (public)
router.get("/ref/:id", async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findOne({
      where: { id: req.params.id },
      include: [
        { model: Staff, as: "staff" },
        { model: Service, as: "service" },
      ],
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({ error: "Failed to get booking" });
  }
});

// Cancel booking (public with booking reference)
router.put(
  "/cancel/:booking_ref",
  [body("email").isEmail().normalizeEmail()],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const booking = await Booking.findOne({
        where: {
          booking_ref: req.params.booking_ref,
          customer_email: req.body.email,
        },
      });

      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      if (booking.status === "cancelled") {
        return res.status(400).json({ error: "Booking is already cancelled" });
      }

      await booking.update({ status: "cancelled" });

      res.json({
        success: true,
        message: "Booking cancelled successfully",
      });
    } catch (error) {
      console.error("Cancel booking error:", error);
      res.status(500).json({ error: "Failed to cancel booking" });
    }
  }
);

// Get all bookings (admin only)
router.get("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { date, staff_id, status, page = 1, limit = 20 } = req.query;
    const where: any = {};

    if (date) where.booking_date = date;
    if (staff_id) where.staff_id = staff_id;
    if (status) where.status = status;

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await Booking.findAndCountAll({
      where,
      include: [
        { model: Staff, as: "staff" },
        { model: Service, as: "service" },
      ],
      order: [
        ["booking_date", "DESC"],
        ["start_time", "DESC"],
      ],
      limit: Number(limit),
      offset: Number(offset),
    });

    res.json({
      success: true,
      bookings: rows,
      total: count,
      page: Number(page),
      totalPages: Math.ceil(count / Number(limit)),
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ error: "Failed to get bookings" });
  }
});

// Update booking status (admin only)
router.put(
  "/:id/status",
  authenticateToken,
  [body("status").isIn(["confirmed", "cancelled", "completed", "no-show"])],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const booking = await Booking.findByPk(req.params.id);

      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      await booking.update({ status: req.body.status });

      res.json({
        success: true,
        booking,
      });
    } catch (error) {
      console.error("Update booking status error:", error);
      res.status(500).json({ error: "Failed to update booking status" });
    }
  }
);

// Get booking stats (admin only)
router.get("/stats", authenticateToken, async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const todayBookings = await Booking.count({
      where: {
        booking_date: today,
        status: "confirmed",
      },
    });

    // Find today's confirmed/completed bookings
    const todayBookingsRecords = await Booking.findAll({
      where: {
        booking_date: today,
        status: { [Op.in]: ["confirmed", "completed"] },
      },
      include: [{ model: Service, as: "service" }],
    });

    // Accumulate revenue from service.price
    const todayRevenue = todayBookingsRecords.reduce(
      (sum: number, booking: any) => {
        // booking.service may be null if association is missing
        return (
          sum + (booking.service?.price ? Number(booking.service.price) : 0)
        );
      },
      0
    );

    const monthlyBookings = await Booking.count({
      where: {
        booking_date: {
          [Op.gte]: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
          ),
        },
        status: { [Op.in]: ["confirmed", "completed"] },
      },
    });

    res.json({
      success: true,
      stats: {
        todayBookings,
        todayRevenue: todayRevenue || 0,
        monthlyBookings,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ error: "Failed to get stats" });
  }
});

export default router;
