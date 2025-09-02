import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import sequelize from "./config/database";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5020;

// Import routes
import authRoutes from "./routes/auth.routes";
import bookingRoutes from "./routes/booking.routes";
import serviceRoutes from "./routes/service.routes";
import staffRoutes from "./routes/staff.routes";
import adminRoutes from "./routes/admin.routes";

// Middleware
app.use(helmet());

// CORS configuration
const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
    ];
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || origin.startsWith("file://")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: "Too many login attempts, please try again later.",
});

app.use("/api/", limiter);
app.use("/api/admin/login", authLimiter);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/admin", adminRoutes);

// Business info endpoint (public)
app.get("/api/business/info", (req: Request, res: Response) => {
  res.json({
    name: process.env.BUSINESS_NAME || "BeauBook Salon",
    email: process.env.BUSINESS_EMAIL || "info@beaubook.com",
    phone: process.env.BUSINESS_PHONE || "(555) 123-4567",
    address: process.env.BUSINESS_ADDRESS || "123 Beauty Lane, Vancouver, BC",
    hours: {
      monday: { open: "09:00", close: "18:00" },
      tuesday: { open: "09:00", close: "18:00" },
      wednesday: { open: "09:00", close: "18:00" },
      thursday: { open: "09:00", close: "18:00" },
      friday: { open: "09:00", close: "18:00" },
      saturday: { open: "10:00", close: "16:00" },
      sunday: { open: null, close: null },
    },
  });
});

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "BeauBook API Server",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      business: "/api/business/info",
      services: "/api/services",
      staff: "/api/staff",
      bookings: "/api/bookings",
      admin: "/api/admin",
    },
  });
});

// Error handling middleware
interface CustomError extends Error {
  status?: number;
}

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  // Handle CORS errors
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "CORS policy violation" });
  }

  // Handle validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation Error",
      details: err.message,
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Invalid token" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Token expired" });
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.message || "Something went wrong!",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Database connection and server start
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    // Sync database models (create tables if they don't exist)
    // In production, you should use migrations instead
    if (process.env.NODE_ENV !== "production") {
      await sequelize.sync({ force: true });
      console.log("✅ Database synchronized successfully.");

      // Initialize default data
      const { initializeDefaultData } = await import("./utils/initData");
      await initializeDefaultData();
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🌐 API URL: http://localhost:${PORT}`);
      console.log(
        `💻 Frontend URL: ${
          process.env.FRONTEND_URL || "http://localhost:3000"
        }`
      );
    });
  } catch (error) {
    console.error("❌ Unable to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing HTTP server");
  await sequelize.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT signal received: closing HTTP server");
  await sequelize.close();
  process.exit(0);
});

export default app;
