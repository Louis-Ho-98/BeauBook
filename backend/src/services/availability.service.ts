import { Op } from "sequelize";
import { Staff, StaffSchedule, StaffBreak, Booking } from "../models";

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Schedule {
  start_time: string;
  end_time: string;
}

export interface Break {
  start_time: string;
  end_time: string;
}

export interface BookingRange {
  start_time: string;
  end_time: string;
}

export function calculateAvailability(
  schedule: Schedule | null,
  breaks: Break[],
  bookings: BookingRange[],
  duration: number
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  if (!schedule) return slots;

  const [startHour, startMin] = schedule.start_time.split(":").map(Number);
  const [endHour, endMin] = schedule.end_time.split(":").map(Number);
  const scheduleStart = startHour * 60 + startMin;
  const scheduleEnd = endHour * 60 + endMin;

  const breakRanges = breaks.map((b) => {
    const [breakStartHour, breakStartMin] = b.start_time.split(":").map(Number);
    const [breakEndHour, breakEndMin] = b.end_time.split(":").map(Number);
    return {
      start: breakStartHour * 60 + breakStartMin,
      end: breakEndHour * 60 + breakEndMin,
    };
  });

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

  for (let time = scheduleStart; time <= scheduleEnd - duration; time += 30) {
    const slotEnd = time + duration;
    if (slotEnd > scheduleEnd) continue;
    const overlapBreak = breakRanges.some(
      (range) => time < range.end && slotEnd > range.start
    );
    if (overlapBreak) continue;
    const overlapBooking = bookingRanges.some(
      (range) => time < range.end && slotEnd > range.start
    );
    if (overlapBooking) continue;
    const hours = Math.floor(time / 60);
    const mins = time % 60;
    const timeStr = `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
    slots.push({ time: timeStr, available: true });
  }
  return slots;
}

export async function getAvailableStaff(
  serviceId: string,
  date: string,
  models: {
    Staff: typeof Staff;
    StaffSchedule: typeof StaffSchedule;
    StaffBreak: typeof StaffBreak;
    Booking: typeof Booking;
  }
) {
  const { Staff, StaffSchedule } = models;
  const staff = await Staff.findAll({
    where: {
      is_active: true,
      specialties: {
        [Op.contains]: [serviceId],
      },
    },
  });
  const dayOfWeek = new Date(date).getDay();
  const availableStaff: any[] = [];
  for (const staffMember of staff) {
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
