import { Response, NextFunction } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import { AuthRequest, TokenPayload } from "../types";

// We'll import the Admin model later when we convert it to TypeScript
// For now, we'll use a placeholder type
interface AdminModel {
  findByPk: (id: number) => Promise<any>;
}

const Admin: AdminModel = require("../models").Admin;

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ error: "Access token required" });
      return;
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      async (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            res.status(401).json({ error: "Token expired" });
            return;
          }
          res.status(403).json({ error: "Invalid token" });
          return;
        }

        const payload = decoded as TokenPayload;

        // Find admin user
        const admin = await Admin.findByPk(payload.id);
        if (!admin) {
          res.status(404).json({ error: "Admin not found" });
          return;
        }

        // Attach user info to request
        req.user = {
          id: admin.id,
          email: admin.email,
          role: admin.role || "admin",
        };

        next();
      }
    );
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Authentication error" });
  }
};

export const generateTokens = (
  adminId: number
): { accessToken: string; refreshToken: string } => {
  const accessToken = jwt.sign(
    { id: adminId },
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_EXPIRE || "15m",
    } as SignOptions
  );

  const refreshToken = jwt.sign(
    { id: adminId },
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d",
    } as SignOptions
  );

  return { accessToken, refreshToken };
};

export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string
    ) as TokenPayload;
  } catch (error) {
    return null;
  }
};

// Role-based access control middleware
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }

    next();
  };
};

// Optional authentication - doesn't fail if no token, but adds user if valid
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      next();
      return;
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      async (err, decoded) => {
        if (!err && decoded) {
          const payload = decoded as TokenPayload;
          const admin = await Admin.findByPk(payload.id);

          if (admin) {
            req.user = {
              id: admin.id,
              email: admin.email,
              role: admin.role || "admin",
            };
          }
        }
        next();
      }
    );
  } catch (error) {
    // Continue without authentication
    next();
  }
};
