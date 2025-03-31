const { validationResult } = require("express-validator");
const db = require("../models");
const {
  hashPassword,
  comparePassword,
  successResponse,
  errorResponse,
} = require("../utils/helpers");
const { generateToken } = require("../utils/jwt");

// Register a new user
const register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation error", 400, errors.array());
    }

    const { name, email, password, address } = req.body;

    // Check if user already exists
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return errorResponse(res, "User with this email already exists", 400);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const user = await db.User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role: "user", // Default role is 'user'
    });

    // Generate JWT token
    const token = generateToken({ id: user.id, role: user.role });

    return successResponse(
      res,
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      "User registered successfully",
      201
    );
  } catch (error) {
    console.error("Registration error:", error);
    return errorResponse(res, "Error registering user", 500);
  }
};

// Login user
const login = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation error", 400, errors.array());
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    // Compare passwords
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    // Generate JWT token
    const token = generateToken({ id: user.id, role: user.role });

    return successResponse(
      res,
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      "Login successful"
    );
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse(res, "Error logging in", 500);
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation error", 400, errors.array());
    }

    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Find user by id
    const user = await db.User.findByPk(userId);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    // Verify current password
    const isPasswordValid = await comparePassword(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return errorResponse(res, "Current password is incorrect", 400);
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await user.update({ password: hashedPassword });

    return successResponse(res, null, "Password changed successfully");
  } catch (error) {
    console.error("Change password error:", error);
    return errorResponse(res, "Error changing password", 500);
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find user by id
    const user = await db.User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    return successResponse(res, user, "User profile retrieved successfully");
  } catch (error) {
    console.error("Get profile error:", error);
    return errorResponse(res, "Error retrieving user profile", 500);
  }
};

module.exports = {
  register,
  login,
  changePassword,
  getProfile,
};
