const express = require("express");
const router = express.Router();
const storeOwnerController = require("../controllers/storeOwner.controller");
const { authenticate } = require("../middlewares/auth");
const { isStoreOwner } = require("../middlewares/roleCheck");

// Apply authentication and store owner role check middleware to all routes
router.use(authenticate);
router.use(isStoreOwner);

// Store owner dashboard routes
router.get("/dashboard", storeOwnerController.getDashboardStats);
router.get("/store", storeOwnerController.getStoreDetails);
router.get("/ratings", storeOwnerController.getStoreRatings);

module.exports = router;
