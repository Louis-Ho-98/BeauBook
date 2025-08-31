const jwt = require("jsonwebtoken");
const { Admin } = require("../models");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ error: "Token expired" });
        }
        return res.status(403).json({ error: "Invalid token" });
      }

      // Find admin user
      const admin = await Admin.findByPk(decoded.id);
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }

      req.admin = admin;
      next();
    });
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Authentication error" });
  }
};

const generateTokens = (adminId) => {
  const accessToken = jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "15m",
  });

  const refreshToken = jwt.sign(
    { id: adminId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d" }
  );

  return { accessToken, refreshToken };
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  authenticateToken,
  generateTokens,
  verifyRefreshToken,
};
