const router = require("express").Router();
const { Op } = require("sequelize");
const {
  Booking,
  Staff,
  Service,
  StaffSchedule,
  StaffBreak,
} = require("../models");
const { authenticateToken } = require("../middleware/auth.middleware");
const { body, validationResult } = require("express-validator");
const { calculateAvailability } = require("../services/availability.service");

// Get available time slots (public)
router.post(
  "/availability",
  [
    body("staff_id").notEmpty().isUUID(),
    body("service_id").notEmpty().isUUID(),
    body("date").notEmpty().isISO8601(),
  ],
  async (req, res) => {
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
      const dayOfWeek = new Date(date).getDay();
      const schedule = await StaffSchedule.findOne({
        where: {
          staff_id,
          day_of_week: dayOfWeek,
          is_active: true,
        },
      });

      if (!schedule) {
        return res.json({ success: true, slots: [] });
      }

      // Get breaks for the day
      const breaks = await StaffBreak.findAll({
        where: {
          staff_id,
          day_of_week: dayOfWeek,
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
        service.duration_minutes
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
    body("staff_id").notEmpty().isUUID(),
    body("service_id").notEmpty().isUUID(),
    body("booking_date").notEmpty().isISO8601(),
    body("start_time")
      .notEmpty()
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    body("notes").optional().trim(),
  ],
  async (req, res) => {
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
      const endMinutes = startMinutes + service.duration_minutes;
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
      });

      // Load complete booking with associations
      const completeBooking = await Booking.findByPk(booking.id, {
        include: [
          { model: Staff, as: "staff" },
          { model: Service, as: "service" },
        ],
      });

      // TODO: Send confirmation email
      // await sendBookingConfirmation(completeBooking);

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
router.get("/ref/:booking_ref", async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: { booking_ref: req.params.booking_ref },
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
  async (req, res) => {
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

      // TODO: Send cancellation email
      // await sendCancellationEmail(booking);

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
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { date, staff_id, status, page = 1, limit = 20 } = req.query;
    const where = {};

    if (date) where.booking_date = date;
    if (staff_id) where.staff_id = staff_id;
    if (status) where.status = status;

    const offset = (page - 1) * limit;

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
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      success: true,
      bookings: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
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
  async (req, res) => {
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
router.get("/stats", authenticateToken, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const todayBookings = await Booking.count({
      where: {
        booking_date: today,
        status: "confirmed",
      },
    });

    const todayRevenue = await Booking.sum("service.price", {
      where: {
        booking_date: today,
        status: { [Op.in]: ["confirmed", "completed"] },
      },
      include: [{ model: Service, as: "service" }],
    });

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

module.exports = router;
