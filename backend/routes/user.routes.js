const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/auth");
const { ratingValidationRules } = require("../utils/validators");

// Apply authentication middleware to all routes
router.use(authenticate);

// Store listing routes
router.get("/stores", userController.getStores);
router.get("/stores/:id", userController.getStoreById);

// Rating routes
router.post(
  "/ratings",
  ratingValidationRules.create,
  userController.submitRating
);

module.exports = router;
