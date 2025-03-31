const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const sequelize = require("./config/dbConfig");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

// Import routes
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const userRoutes = require("./routes/user.routes");
const storeOwnerRoutes = require("./routes/storeOwner.routes");

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/store-owner", storeOwnerRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Store Rating API is running! 🚀");
});

// Create admin user if doesn't exist
const seedAdmin = async () => {
  try {
    const { User } = require("./models");
    const { hashPassword } = require("./utils/helpers");

    const adminExists = await User.findOne({
      where: { email: "admin@example.com" },
    });

    if (!adminExists) {
      // Make sure password meets the requirements before hashing
      const adminPassword = "Admin@123456"; // Has uppercase and special char

      // Verify password format before hashing
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]).{8,16}$/;
      if (!passwordRegex.test(adminPassword)) {
        console.error("❌ Admin password doesn't meet requirements");
        return;
      }

      const hashedPassword = await hashPassword(adminPassword);

      await User.create({
        name: "System Administrator User Account", // Min 20 chars as per validation
        email: "admin@example.com",
        password: hashedPassword,
        address: "Admin Office, Headquarters, Floor 20",
        role: "admin",
      });

      console.log("✅ Admin user created successfully");
    } else {
      console.log("ℹ️ Admin user already exists");
    }
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
  }
};

// 404 middleware - This needs to be a function, not an object
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Sync database and start server
sequelize
  .sync()
  .then(async () => {
    console.log("📚 Database synced successfully");

    // Seed admin user
    await seedAdmin();

    app.listen(port, () => {
      console.log(`🚀 Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Unable to sync database:", err);
  });
