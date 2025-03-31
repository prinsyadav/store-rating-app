const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares/auth");
const { authValidationRules } = require("../utils/validators");

// Route for user registration
router.post("/register", authValidationRules.register, authController.register);

// Route for user login
router.post("/login", authValidationRules.login, authController.login);

// Route for changing password (requires authentication)
router.post(
  "/change-password",
  authenticate,
  authValidationRules.changePassword,
  authController.changePassword
);

// Route for getting user profile (requires authentication)
router.get("/profile", authenticate, authController.getProfile);

module.exports = router;
