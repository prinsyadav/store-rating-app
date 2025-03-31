const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const db = require("../models");
const { successResponse, errorResponse } = require("../utils/helpers");

// Get all stores with filtering and user's ratings
const getStores = async (req, res) => {
  try {
    const { name, address } = req.query;
    const userId = req.user.id;
    const whereClause = {};

    // Apply filters if provided
    if (name) whereClause.name = { [Op.iLike]: `%${name}%` };
    if (address) whereClause.address = { [Op.iLike]: `%${address}%` };

    // Find stores with their ratings
    const stores = await db.Store.findAll({
      where: whereClause,
      attributes: ["id", "name", "address", "averageRating"],
      order: [["name", "ASC"]],
    });

    // Get user's ratings for these stores
    const userRatings = await db.Rating.findAll({
      where: {
        userId,
        storeId: stores.map((store) => store.id),
      },
      attributes: ["storeId", "score", "id"],
    });

    // Create a map of storeId to user's rating
    const userRatingMap = userRatings.reduce((map, rating) => {
      map[rating.storeId] = { score: rating.score, id: rating.id };
      return map;
    }, {});

    // Add user's rating to each store
    const storesWithUserRating = stores.map((store) => {
      const storeObj = store.toJSON();
      storeObj.userRating = userRatingMap[store.id] || null;
      return storeObj;
    });

    return successResponse(
      res,
      storesWithUserRating,
      "Stores retrieved successfully"
    );
  } catch (error) {
    console.error("Get stores error:", error);
    return errorResponse(res, "Error retrieving stores", 500);
  }
};

// Get store by ID with user's rating
const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find store by id
    const store = await db.Store.findByPk(id, {
      attributes: ["id", "name", "address", "email", "averageRating"],
    });

    if (!store) {
      return errorResponse(res, "Store not found", 404);
    }

    // Get user's rating for this store
    const userRating = await db.Rating.findOne({
      where: { userId, storeId: id },
      attributes: ["id", "score", "comment"],
    });

    // Add user's rating to store
    const result = store.toJSON();
    result.userRating = userRating || null;

    return successResponse(res, result, "Store retrieved successfully");
  } catch (error) {
    console.error("Get store by ID error:", error);
    return errorResponse(res, "Error retrieving store", 500);
  }
};

// Submit or update a rating
const submitRating = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, "Validation error", 400, errors.array());
    }

    const { storeId, score, comment } = req.body;
    const userId = req.user.id;

    // Check if store exists
    const store = await db.Store.findByPk(storeId);
    if (!store) {
      return errorResponse(res, "Store not found", 404);
    }

    // Check if user already rated this store
    const existingRating = await db.Rating.findOne({
      where: { userId, storeId },
    });

    let rating;

    if (existingRating) {
      // Update existing rating
      rating = await existingRating.update({
        score,
        comment,
      });
    } else {
      // Create new rating
      rating = await db.Rating.create({
        userId,
        storeId,
        score,
        comment,
      });
    }

    // Update store's average rating
    const storeRatings = await db.Rating.findAll({
      where: { storeId },
      attributes: ["score"],
    });

    const totalScore = storeRatings.reduce((sum, item) => sum + item.score, 0);
    const averageRating = totalScore / storeRatings.length;

    await store.update({ averageRating });

    return successResponse(
      res,
      { rating, averageRating },
      "Rating submitted successfully"
    );
  } catch (error) {
    console.error("Submit rating error:", error);
    return errorResponse(res, "Error submitting rating", 500);
  }
};

module.exports = {
  getStores,
  getStoreById,
  submitRating,
};
