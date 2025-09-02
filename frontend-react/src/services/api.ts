import axios, { AxiosInstance, AxiosError } from "axios";
import {
  Service,
  Staff,
  Booking,
  TimeSlot,
  AuthResponse,
  LoginCredentials,
  AvailabilityRequest,
  BookingRequest,
  BusinessSettings,
  Admin,
  StaffSchedule,
} from "@/types";

// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5020/api";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post(
            `${API_BASE_URL}/auth/admin/refresh`,
            {
              refreshToken,
            }
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);

// Public API calls
export const publicApi = {
  // Business info
  getBusinessInfo: async (): Promise<BusinessSettings> => {
    const response = await api.get("/business/info");
    return response.data;
  },

  // Services
  getServices: async (): Promise<Service[]> => {
    const response = await api.get("/services");
    return response.data.services;
  },

  getService: async (id: string): Promise<Service> => {
    const response = await api.get(`/services/${id}`);
    return response.data.service;
  },

  // Staff
  getStaff: async (): Promise<Staff[]> => {
    const response = await api.get("/staff");
    return response.data.staff;
  },

  getStaffMember: async (id: string): Promise<Staff> => {
    const response = await api.get(`/staff/${id}`);
    return response.data.staff;
  },

  getStaffServices: async (staffId: string): Promise<Service[]> => {
    const response = await api.get(`/staff/${staffId}/services`);
    return response.data.services;
  },

  // Availability
  getAvailability: async (
    request: AvailabilityRequest
  ): Promise<TimeSlot[]> => {
    const response = await api.post("/bookings/availability", request);
    return response.data.slots;
  },

  // Bookings
  createBooking: async (booking: BookingRequest): Promise<Booking> => {
    const response = await api.post("/bookings", booking);
    return response.data.booking;
  },

  getBookingById: async (ref: string): Promise<Booking> => {
    const response = await api.get(`/bookings/ref/${ref}`);
    return response.data.booking;
  },

  cancelBooking: async (ref: string, email: string): Promise<void> => {
    await api.put(`/bookings/cancel/${ref}`, { email });
  },
};

// Authentication API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post("/auth/admin/login", credentials);
    const data = response.data;

    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
    }

    return data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/admin/logout");
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  },

  getProfile: async (): Promise<Admin> => {
    const response = await api.get("/auth/admin/profile");
    return response.data.admin;
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await api.post("/auth/admin/refresh", { refreshToken });

    const data = response.data;
    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
    }

    return data;
  },
};

// Admin API calls
export const adminApi = {
  // Bookings
  getBookings: async (params?: {
    date?: string;
    staff_id?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    bookings: Booking[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const response = await api.get("/bookings", { params });
    return response.data;
  },

  updateBookingStatus: async (
    id: string,
    status: "confirmed" | "cancelled" | "completed" | "no-show"
  ): Promise<Booking> => {
    const response = await api.put(`/bookings/${id}/status`, { status });
    return response.data.booking;
  },

  getBookingStats: async (): Promise<{
    todayBookings: number;
    todayRevenue: number;
    monthlyBookings: number;
  }> => {
    const response = await api.get("/bookings/stats");
    return response.data.stats;
  },

  // Staff management
  createStaff: async (staff: Partial<Staff>): Promise<Staff> => {
    const response = await api.post("/staff", staff);
    return response.data.staff;
  },

  updateStaff: async (id: string, staff: Partial<Staff>): Promise<Staff> => {
    const response = await api.put(`/staff/${id}`, staff);
    return response.data.staff;
  },

  deleteStaff: async (id: string): Promise<void> => {
    await api.delete(`/staff/${id}`);
  },

  updateStaffSchedule: async (
    staffId: string,
    schedules: Partial<StaffSchedule>[]
  ): Promise<StaffSchedule[]> => {
    const response = await api.put(`/staff/${staffId}/schedule`, { schedules });
    return response.data.schedules;
  },

  // Service management
  createService: async (service: Partial<Service>): Promise<Service> => {
    const response = await api.post("/services", service);
    return response.data.service;
  },

  updateService: async (
    id: string,
    service: Partial<Service>
  ): Promise<Service> => {
    const response = await api.put(`/services/${id}`, service);
    return response.data.service;
  },

  deleteService: async (id: string): Promise<void> => {
    await api.delete(`/services/${id}`);
  },

  // Business settings
  getSettings: async (): Promise<BusinessSettings> => {
    const response = await api.get("/admin/settings");
    return response.data.settings;
  },

  updateSettings: async (
    settings: Partial<BusinessSettings>
  ): Promise<BusinessSettings> => {
    const response = await api.put("/admin/settings", settings);
    return response.data.settings;
  },

  // Admin management
  getAdmins: async (): Promise<Admin[]> => {
    const response = await api.get("/admin/admins");
    return response.data.admins;
  },

  createAdmin: async (admin: {
    email: string;
    password: string;
    name: string;
    role?: string;
  }): Promise<Admin> => {
    const response = await api.post("/admin/admins", admin);
    return response.data.admin;
  },

  updateAdmin: async (id: string, admin: Partial<Admin>): Promise<Admin> => {
    const response = await api.put(`/admin/admins/${id}`, admin);
    return response.data.admin;
  },

  deleteAdmin: async (id: string): Promise<void> => {
    await api.delete(`/admin/admins/${id}`);
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    await api.put("/admin/change-password", {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },
};

// Export convenience APIs for components
export const servicesApi = {
  getAll: publicApi.getServices,
  getById: publicApi.getService,
  create: adminApi.createService,
  update: adminApi.updateService,
  delete: adminApi.deleteService,
};

export const staffApi = {
  getAll: publicApi.getStaff,
  getById: publicApi.getStaffMember,
  create: adminApi.createStaff,
  update: adminApi.updateStaff,
  delete: adminApi.deleteStaff,
  getServices: publicApi.getStaffServices,
  updateSchedule: adminApi.updateStaffSchedule,
};

export const bookingsApi = {
  create: publicApi.createBooking,
  getByRef: publicApi.getBookingById,
  cancel: publicApi.cancelBooking,
  getAvailableSlots: publicApi.getAvailability,
  getAll: adminApi.getBookings,
  updateStatus: adminApi.updateBookingStatus,
  getStats: adminApi.getBookingStats,
};

export default api;
