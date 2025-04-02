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

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://store-rating-app-sigma.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

// Apply CORS with the configuration
app.use(cors(corsOptions));

// Middleware
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
      const adminPassword = "Admin@123456";

      // Verify password format before hashing
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]).{8,16}$/;
      if (!passwordRegex.test(adminPassword)) {
        console.error("Admin password doesn't meet requirements");
        return;
      }

      const hashedPassword = await hashPassword(adminPassword);

      await User.create({
        name: "System Administrator User Account",
        email: "admin@example.com",
        password: hashedPassword,
        address: "Admin Office, Headquarters, Floor 20",
        role: "admin",
      });

      console.log("Admin user created successfully");
    } else {
      console.log("Admin user already exists");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
};

// Sync database and start server
sequelize
  .sync()
  .then(async () => {
    console.log("Database synced successfully");

    // Seed admin user
    await seedAdmin();

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Unable to sync database:", err);
  });
