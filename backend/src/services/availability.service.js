/**
 * Calculate available time slots based on schedule, breaks, and existing bookings
 */
function calculateAvailability(schedule, breaks, bookings, duration) {
  const slots = [];

  if (!schedule) return slots;

  // Parse schedule times
  const [startHour, startMin] = schedule.start_time.split(":").map(Number);
  const [endHour, endMin] = schedule.end_time.split(":").map(Number);

  const scheduleStart = startHour * 60 + startMin;
  const scheduleEnd = endHour * 60 + endMin;

  // Convert breaks to minute ranges
  const breakRanges = breaks.map((b) => {
    const [breakStartHour, breakStartMin] = b.start_time.split(":").map(Number);
    const [breakEndHour, breakEndMin] = b.end_time.split(":").map(Number);
    return {
      start: breakStartHour * 60 + breakStartMin,
      end: breakEndHour * 60 + breakEndMin,
    };
  });

  // Convert bookings to minute ranges
  const bookingRanges = bookings.map((b) => {
    const [bookingStartHour, bookingStartMin] = b.start_time
      .split(":")
      .map(Number);
    const [bookingEndHour, bookingEndMin] = b.end_time.split(":").map(Number);
    return {
      start: bookingStartHour * 60 + bookingStartMin,
      end: bookingEndHour * 60 + bookingEndMin,
    };
  });

  // Generate time slots every 30 minutes
  for (let time = scheduleStart; time <= scheduleEnd - duration; time += 30) {
    const slotEnd = time + duration;

    // Check if slot is within working hours
    if (slotEnd > scheduleEnd) continue;

    // Check if slot overlaps with breaks
    const overlapBreak = breakRanges.some(
      (range) => time < range.end && slotEnd > range.start
    );
    if (overlapBreak) continue;

    // Check if slot overlaps with existing bookings
    const overlapBooking = bookingRanges.some(
      (range) => time < range.end && slotEnd > range.start
    );
    if (overlapBooking) continue;

    // Convert back to time format
    const hours = Math.floor(time / 60);
    const mins = time % 60;
    const timeStr = `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;

    slots.push({
      time: timeStr,
      available: true,
    });
  }

  return slots;
}

/**
 * Get all available staff for a service on a specific date
 */
async function getAvailableStaff(serviceId, date, models) {
  const { Staff, StaffSchedule, StaffBreak, Booking } = models;

  // Get all staff who can perform this service
  const staff = await Staff.findAll({
    where: {
      is_active: true,
      specialties: {
        [Op.contains]: [serviceId],
      },
    },
  });

  const dayOfWeek = new Date(date).getDay();
  const availableStaff = [];

  for (const staffMember of staff) {
    // Check if staff works on this day
    const schedule = await StaffSchedule.findOne({
      where: {
        staff_id: staffMember.id,
        day_of_week: dayOfWeek,
        is_active: true,
      },
    });

    if (schedule) {
      availableStaff.push({
        ...staffMember.toJSON(),
        schedule,
      });
    }
  }

  return availableStaff;
}

module.exports = {
  calculateAvailability,
  getAvailableStaff,
};
