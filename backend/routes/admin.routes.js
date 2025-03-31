const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { authenticate } = require("../middlewares/auth");
const { isAdmin } = require("../middlewares/roleCheck");
const {
  userValidationRules,
  storeValidationRules,
} = require("../utils/validators");

// Apply authentication and admin role check middleware to all routes
router.use(authenticate);
router.use(isAdmin);

// Dashboard routes
router.get("/dashboard", adminController.getDashboardStats);

// User management routes
router.get("/users", adminController.getUsers);
router.get("/users/:id", adminController.getUserById);
router.post("/users", userValidationRules.create, adminController.createUser);
router.put(
  "/users/:id",
  userValidationRules.update,
  adminController.updateUser
);
router.delete("/users/:id", adminController.deleteUser);

// Store management routes
router.get("/stores", adminController.getStores);
router.get("/stores/:id", adminController.getStoreById);
router.post(
  "/stores",
  storeValidationRules.create,
  adminController.createStore
);
router.put(
  "/stores/:id",
  storeValidationRules.update,
  adminController.updateStore
);
router.delete("/stores/:id", adminController.deleteStore);

module.exports = router;
