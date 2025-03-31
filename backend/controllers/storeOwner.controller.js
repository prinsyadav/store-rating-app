const db = require("../models");
const { successResponse, errorResponse } = require("../utils/helpers");

// Get store owner's store details
const getStoreDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find owner's store
    const store = await db.Store.findOne({
      where: { userId },
      attributes: [
        "id",
        "name",
        "email",
        "address",
        "averageRating",
        "createdAt",
      ],
    });

    if (!store) {
      return errorResponse(res, "No store found for this user", 404);
    }

    return successResponse(res, store, "Store details retrieved successfully");
  } catch (error) {
    console.error("Get store details error:", error);
    return errorResponse(res, "Error retrieving store details", 500);
  }
};

// Get store ratings
const getStoreRatings = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find owner's store
    const store = await db.Store.findOne({
      where: { userId },
      attributes: ["id"],
    });

    if (!store) {
      return errorResponse(res, "No store found for this user", 404);
    }

    // Get ratings with user details
    const ratings = await db.Rating.findAll({
      where: { storeId: store.id },
      include: [
        {
          model: db.User,
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return successResponse(
      res,
      ratings,
      "Store ratings retrieved successfully"
    );
  } catch (error) {
    console.error("Get store ratings error:", error);
    return errorResponse(res, "Error retrieving store ratings", 500);
  }
};

// Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find owner's store
    const store = await db.Store.findOne({
      where: { userId },
      attributes: ["id", "averageRating"],
    });

    if (!store) {
      return errorResponse(res, "No store found for this user", 404);
    }

    // Count total ratings
    const totalRatings = await db.Rating.count({
      where: { storeId: store.id },
    });

    // Count ratings by score
    const ratingDistribution = [];
    for (let i = 1; i <= 5; i++) {
      const count = await db.Rating.count({
        where: { storeId: store.id, score: i },
      });
      ratingDistribution.push({ score: i, count });
    }

    return successResponse(
      res,
      {
        storeId: store.id,
        averageRating: store.averageRating,
        totalRatings,
        ratingDistribution,
      },
      "Dashboard statistics retrieved successfully"
    );
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return errorResponse(res, "Error retrieving dashboard statistics", 500);
  }
};

module.exports = {
  getStoreDetails,
  getStoreRatings,
  getDashboardStats,
};
