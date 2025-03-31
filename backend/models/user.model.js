module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: {
            args: [20, 60],
            msg: "Name must be between 20 and 60 characters long",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: "Please enter a valid email address",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        // Remove the regex validation for password since we validate on input
        // but the hashed password won't match the pattern
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: {
            args: [0, 400],
            msg: "Address cannot exceed 400 characters",
          },
        },
      },
      role: {
        type: DataTypes.ENUM("admin", "user", "storeOwner"),
        defaultValue: "user",
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: "users",
    }
  );

  return User;
};
