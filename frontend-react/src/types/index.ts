// Service types
export interface Service {
  id: string;
  name: string;
  description?: string;
  duration_minutes: number;
  price: number;
  category: string;
  is_active: boolean;
  icon?: string;
}

// Staff types
export interface Staff {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  bio?: string;
  specialties: string[];
  avatar_url?: string;
  is_active: boolean;
  role?: string;
  schedules?: StaffSchedule[];
  breaks?: StaffBreak[];
}

// Schedule types
export interface StaffSchedule {
  id: string;
  staff_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

export interface StaffBreak {
  id: string;
  staff_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

// Booking types
export interface Booking {
  id: string;
  booking_ref: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  staff_id: string;
  service_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: "confirmed" | "cancelled" | "completed" | "no-show";
  notes?: string;
  staff?: Staff;
  service?: Service;
  created_at?: string;
  updated_at?: string;
}

// Admin types
export interface Admin {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  admin?: Admin;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}

// Business settings
export interface BusinessSettings {
  id: string;
  business_name: string;
  business_address?: string;
  business_phone?: string;
  business_email?: string;
  opening_time: string;
  closing_time: string;
  booking_buffer_minutes: number;
  max_advance_booking_days: number;
  timezone: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Availability types
export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface AvailabilityRequest {
  staff_id: string;
  service_id: string;
  date: string;
}

// Booking request
export interface BookingRequest {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  staff_id: string;
  service_id: string;
  booking_date: string;
  start_time: string;
  notes?: string;
}

// App state types
export interface BookingState {
  selectedService: Service | null;
  selectedStaff: Staff | null;
  selectedDate: string | null;
  selectedTime: string | null;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    notes?: string;
  };
}
