const { body, param, query } = require("express-validator");

// User validation rules
const userValidationRules = {
  create: [
    body("name")
      .isLength({ min: 20, max: 60 })
      .withMessage("Name must be between 20 and 60 characters"),
    body("email").isEmail().withMessage("Please provide a valid email address"),
    body("password")
      .isLength({ min: 8, max: 16 })
      .withMessage("Password must be between 8 and 16 characters")
      .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/)
      .withMessage(
        "Password must include at least one uppercase letter and one special character"
      ),
    body("address")
      .optional()
      .isLength({ max: 400 })
      .withMessage("Address cannot exceed 400 characters"),
    body("role")
      .optional()
      .isIn(["admin", "user", "storeOwner"])
      .withMessage("Invalid role specified"),
  ],
  update: [
    body("name")
      .optional()
      .isLength({ min: 20, max: 60 })
      .withMessage("Name must be between 20 and 60 characters"),
    body("email")
      .optional()
      .isEmail()
      .withMessage("Please provide a valid email address"),
    body("address")
      .optional()
      .isLength({ max: 400 })
      .withMessage("Address cannot exceed 400 characters"),
  ],
  changePassword: [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 8, max: 16 })
      .withMessage("Password must be between 8 and 16 characters")
      .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/)
      .withMessage(
        "Password must include at least one uppercase letter and one special character"
      ),
  ],
};

// Store validation rules
const storeValidationRules = {
  create: [
    body("name")
      .isLength({ min: 20, max: 60 })
      .withMessage("Store name must be between 20 and 60 characters"),
    body("email").isEmail().withMessage("Please provide a valid email address"),
    body("address")
      .isLength({ min: 1, max: 400 })
      .withMessage(
        "Address must not be empty and cannot exceed 400 characters"
      ),
    body("userId").isInt().withMessage("Invalid user ID"),
  ],
  update: [
    body("name")
      .optional()
      .isLength({ min: 20, max: 60 })
      .withMessage("Store name must be between 20 and 60 characters"),
    body("email")
      .optional()
      .isEmail()
      .withMessage("Please provide a valid email address"),
    body("address")
      .optional()
      .isLength({ min: 1, max: 400 })
      .withMessage(
        "Address must not be empty and cannot exceed 400 characters"
      ),
  ],
};

// Rating validation rules
const ratingValidationRules = {
  create: [
    body("score")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    body("comment")
      .optional()
      .isString()
      .withMessage("Comment must be a string"),
    body("storeId").isInt().withMessage("Invalid store ID"),
  ],
  update: [
    body("score")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    body("comment")
      .optional()
      .isString()
      .withMessage("Comment must be a string"),
  ],
};

// Auth validation rules
const authValidationRules = {
  login: [
    body("email").isEmail().withMessage("Please provide a valid email address"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  register: [
    body("name")
      .isLength({ min: 20, max: 60 })
      .withMessage("Name must be between 20 and 60 characters"),
    body("email").isEmail().withMessage("Please provide a valid email address"),
    body("password")
      .isLength({ min: 8, max: 16 })
      .withMessage("Password must be between 8 and 16 characters")
      .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/)
      .withMessage(
        "Password must include at least one uppercase letter and one special character"
      ),
    body("address")
      .optional()
      .isLength({ max: 400 })
      .withMessage("Address cannot exceed 400 characters"),
  ],
  changePassword: userValidationRules.changePassword,
};

module.exports = {
  userValidationRules,
  storeValidationRules,
  ratingValidationRules,
  authValidationRules,
};
