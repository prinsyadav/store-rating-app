const { verifyToken } = require("../utils/jwt");
const { errorResponse } = require("../utils/helpers");
const db = require("../models");

// Middleware to verify JWT token
const authenticate = async (req, res, next) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, "Access denied. No token provided", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return errorResponse(res, "Invalid or expired token", 401);
    }

    // Find user by id from decoded token
    const user = await db.User.findByPk(decoded.id);

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    // Set user on request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    next();
  } catch (error) {
    return errorResponse(res, "Authentication failed", 500);
  }
};

module.exports = { authenticate };
