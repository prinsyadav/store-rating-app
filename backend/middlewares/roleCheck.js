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

// Middleware to check if user is either admin or store owner
const isAdminOrStoreOwner = (req, res, next) => {
  if (
    !req.user ||
    (req.user.role !== "admin" && req.user.role !== "storeOwner")
  ) {
    return errorResponse(
      res,
      "Access denied. Admin or store owner role required",
      403
    );
  }
  next();
};

// Middleware to check if user is either admin or the user himself
const isAdminOrSelf = (req, res, next) => {
  if (
    !req.user ||
    (req.user.role !== "admin" && req.user.id !== parseInt(req.params.id))
  ) {
    return errorResponse(
      res,
      "Access denied. You can only access your own resources",
      403
    );
  }
  next();
};

module.exports = {
  isAdmin,
  isStoreOwner,
  isUser,
  isAdminOrStoreOwner,
  isAdminOrSelf,
};
