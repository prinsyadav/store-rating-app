const sequelize = require("../config/dbConfig");
const { DataTypes } = require("sequelize");

// Import models
const User = require("./user.model")(sequelize, DataTypes);
const Store = require("./store.model")(sequelize, DataTypes);
const Rating = require("./rating.model")(sequelize, DataTypes);

// Define associations
User.hasMany(Store, { foreignKey: "userId" });
Store.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Rating, { foreignKey: "userId" });
Rating.belongsTo(User, { foreignKey: "userId" });

Store.hasMany(Rating, { foreignKey: "storeId" });
Rating.belongsTo(Store, { foreignKey: "storeId" });

// Export models
const db = {
  sequelize,
  User,
  Store,
  Rating,
};

module.exports = db;
