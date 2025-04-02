const { errorResponse } = require("../utils/helpers");

// Middleware to check if user has admin role
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return errorResponse(res, "Access denied. Admin role required", 403);
  }
  next();
};

// Middleware to check if user has store owner role
const isStoreOwner = (req, res, next) => {
  if (!req.user || req.user.role !== "storeOwner") {
    return errorResponse(res, "Access denied. Store owner role required", 403);
  }
  next();
};

// Middleware to check if user has normal user role
const isUser = (req, res, next) => {
  if (!req.user || req.user.role !== "user") {
    return errorResponse(res, "Access denied. User role required", 403);
  }
  next();
};

module.exports = {
  isAdmin,
  isStoreOwner,
  isUser,
};
