const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const db = require("../models");
const {
  hashPassword,
  successResponse,
  errorResponse,
} = require("../utils/helpers");

// Dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Count total users
    const totalUsers = await db.User.count();

    // Count total stores
    const totalStores = await db.Store.count();

    // Count total ratings
    const totalRatings = await db.Rating.count();

    return successResponse(
      res,
      {
        totalUsers,
        totalStores,
        totalRatings,
      },
      "Dashboard statistics retrieved successfully"
    );
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return errorResponse(res, "Error retrieving dashboard statistics", 500);
  }
};

// Get all users with filtering
const getUsers = async (req, res) => {
  try {
    const { name, email, address, role } = req.query;
    const whereClause = {};

    // Apply filters if provided
    if (name) whereClause.name = { [Op.iLike]: `%${name}%` };
    if (email) whereClause.email = { [Op.iLike]: `%${email}%` };
    if (address) whereClause.address = { [Op.iLike]: `%${address}%` };
    if (role) whereClause.role = role;

    // Find users based on filter criteria
    const users = await db.User.findAll({
      where: whereClause,
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });

    return successResponse(res, users, "Users retrieved successfully");
  } catch (error) {
    console.error("Get users error:", error);
    return errorResponse(res, "Error retrieving users", 500);
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user by id
    const user = await db.User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    // If user is a store owner, get their store's rating
    let storeRating = null;
    if (user.role === "storeOwner") {
      const store = await db.Store.findOne({
        where: { userId: user.id },
        attributes: ["averageRating"],
      });
      if (store) {
        storeRating = store.averageRating;
      }
    }

    return successResponse(
      res,
      { ...user.toJSON(), storeRating },
      "User retrieved successfully"
    );
  } catch (error) {
    console.error("Get user by ID error:", error);
    return errorResponse(res, "Error retrieving user", 500);
  }
};

// Create a new user
const createUser = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation error", 400, errors.array());
    }

    const { name, email, password, address, role } = req.body;

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
      role: role || "user",
    });

    return successResponse(
      res,
      { id: user.id, name: user.name, email: user.email, role: user.role },
      "User created successfully",
      201
    );
  } catch (error) {
    console.error("Create user error:", error);
    return errorResponse(res, "Error creating user", 500);
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation error", 400, errors.array());
    }

    const { id } = req.params;
    const { name, email, address, role } = req.body;

    // Find user by id
    const user = await db.User.findByPk(id);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    // If email is being changed, check it's not already in use
    if (email && email !== user.email) {
      const existingUser = await db.User.findOne({ where: { email } });
      if (existingUser) {
        return errorResponse(res, "Email already in use", 400);
      }
    }

    // Update user
    await user.update({
      name: name || user.name,
      email: email || user.email,
      address: address || user.address,
      role: role || user.role,
    });

    return successResponse(
      res,
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
      },
      "User updated successfully"
    );
  } catch (error) {
    console.error("Update user error:", error);
    return errorResponse(res, "Error updating user", 500);
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user by id
    const user = await db.User.findByPk(id);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    // Delete user
    await user.destroy();

    return successResponse(res, null, "User deleted successfully");
  } catch (error) {
    console.error("Delete user error:", error);
    return errorResponse(res, "Error deleting user", 500);
  }
};

// Get all stores with filtering
const getStores = async (req, res) => {
  try {
    const { name, email, address } = req.query;
    const whereClause = {};

    // Apply filters if provided
    if (name) whereClause.name = { [Op.iLike]: `%${name}%` };
    if (email) whereClause.email = { [Op.iLike]: `%${email}%` };
    if (address) whereClause.address = { [Op.iLike]: `%${address}%` };

    // Find stores based on filter criteria
    const stores = await db.Store.findAll({
      where: whereClause,
      include: [
        {
          model: db.User,
          attributes: ["name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return successResponse(res, stores, "Stores retrieved successfully");
  } catch (error) {
    console.error("Get stores error:", error);
    return errorResponse(res, "Error retrieving stores", 500);
  }
};

// Get store by ID
const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find store by id
    const store = await db.Store.findByPk(id, {
      include: [
        {
          model: db.User,
          attributes: ["name", "email", "role"],
        },
      ],
    });

    if (!store) {
      return errorResponse(res, "Store not found", 404);
    }

    return successResponse(res, store, "Store retrieved successfully");
  } catch (error) {
    console.error("Get store by ID error:", error);
    return errorResponse(res, "Error retrieving store", 500);
  }
};

// Create a new store
const createStore = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation error", 400, errors.array());
    }

    const { name, email, address, userId } = req.body;

    // Check if user exists and is a store owner
    const user = await db.User.findByPk(userId);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    // Update user role to storeOwner if not already
    if (user.role !== "storeOwner") {
      await user.update({ role: "storeOwner" });
    }

    // Check if store with this email already exists
    const existingStore = await db.Store.findOne({ where: { email } });
    if (existingStore) {
      return errorResponse(res, "Store with this email already exists", 400);
    }

    // Check if user already has a store
    const userStore = await db.Store.findOne({ where: { userId } });
    if (userStore) {
      return errorResponse(res, "User already has a store", 400);
    }

    // Create new store
    const store = await db.Store.create({
      name,
      email,
      address,
      userId,
    });

    return successResponse(res, store, "Store created successfully", 201);
  } catch (error) {
    console.error("Create store error:", error);
    return errorResponse(res, "Error creating store", 500);
  }
};

// Update store
const updateStore = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation error", 400, errors.array());
    }

    const { id } = req.params;
    const { name, email, address } = req.body;

    // Find store by id
    const store = await db.Store.findByPk(id);
    if (!store) {
      return errorResponse(res, "Store not found", 404);
    }

    // If email is being changed, check it's not already in use
    if (email && email !== store.email) {
      const existingStore = await db.Store.findOne({ where: { email } });
      if (existingStore) {
        return errorResponse(res, "Email already in use", 400);
      }
    }

    // Update store
    await store.update({
      name: name || store.name,
      email: email || store.email,
      address: address || store.address,
    });

    return successResponse(res, store, "Store updated successfully");
  } catch (error) {
    console.error("Update store error:", error);
    return errorResponse(res, "Error updating store", 500);
  }
};

// Delete store
const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;

    // Find store by id
    const store = await db.Store.findByPk(id);
    if (!store) {
      return errorResponse(res, "Store not found", 404);
    }

    // Delete store
    await store.destroy();

    // Update user role back to normal user
    await db.User.update({ role: "user" }, { where: { id: store.userId } });

    return successResponse(res, null, "Store deleted successfully");
  } catch (error) {
    console.error("Delete store error:", error);
    return errorResponse(res, "Error deleting store", 500);
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
};
