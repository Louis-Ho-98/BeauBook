import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

// Extend Express Request type to include user
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: "admin" | "staff";
  };
}

// JWT Payload type
export interface TokenPayload extends JwtPayload {
  id: number;
  email: string;
  role: "admin" | "staff";
}

// Admin type
export interface Admin {
  id: number;
  email: string;
  password: string;
  name: string;
  role: "admin" | "super_admin";
  isActive: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Staff type
export interface Staff {
  id: number;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  specialties?: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Service type
export interface Service {
  id: number;
  name: string;
  description?: string;
  category: string;
  duration: number; // in minutes
  price: number;
  isActive: boolean;
  staffIds?: number[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Booking type
export interface Booking {
  id: number;
  bookingRef: string;
  serviceId: number;
  staffId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingDate: Date;
  bookingTime: string;
  duration: number;
  price: number;
  status: "confirmed" | "pending" | "cancelled" | "completed" | "no-show";
  notes?: string;
  service?: Service;
  staff?: Staff;
  createdAt?: Date;
  updatedAt?: Date;
}

// Staff Schedule type
export interface StaffSchedule {
  id: number;
  staffId: number;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isAvailable: boolean;
  staff?: Staff;
  createdAt?: Date;
  updatedAt?: Date;
}

// Staff Break type
export interface StaffBreak {
  id: number;
  staffId: number;
  breakDate?: Date;
  dayOfWeek?: number;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  reason?: string;
  staff?: Staff;
  createdAt?: Date;
  updatedAt?: Date;
}

// Business Settings type
export interface BusinessSettings {
  id: number;
  businessName: string;
  email: string;
  phone: string;
  address?: string;
  website?: string;
  timezone: string;
  currency: string;
  bookingLeadTime: number; // hours
  maxAdvanceBooking: number; // days
  cancellationPolicy?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  businessHours?: {
    [key: string]: {
      open: string | null;
      close: string | null;
    };
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Query parameters
export interface BookingQuery {
  status?: string;
  staffId?: number;
  serviceId?: number;
  date?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface AvailabilityQuery {
  serviceId: number;
  staffId?: number;
  date: string;
}

// Email types
export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  staffName: string;
  bookingDate: string;
  bookingTime: string;
  duration: number;
  price: number;
  bookingRef: string;
  businessName: string;
  businessPhone: string;
  businessEmail: string;
  businessAddress?: string;
}
