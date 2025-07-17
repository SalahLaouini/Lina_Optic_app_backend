// ===============================
// 📦 Import Dependencies
// ===============================
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

// ===============================
// 🚀 Initialize App
// ===============================
const app = express();
const port = process.env.PORT || 5000;

// ===============================
// 🌐 Define Allowed Origins for CORS
// ===============================
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [
      "http://localhost:5173",
      "https://lina-optic-app-frontend-khav.vercel.app",
      "https://lina-optic-app-frontend.vercel.app",
      "https://linaoptic.com",
      "https://www.linaoptic.com"
    ];

// ===============================
// 🛡️ CORS Middleware (Dynamic Origin Support)
// ===============================
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin); // ✅ Respond with the matched origin
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  // Allow common headers and methods
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization");

  // ✅ Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ===============================
// 🧾 Middleware to Parse JSON
// ===============================
app.use(express.json()); // Enable parsing JSON request bodies

// ✅ Serve Static Files (Uploaded Product Images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===============================
// 🔗 API Route Registrations
// ===============================
app.use("/api/products", require("./src/products/product.route"));
app.use("/api/orders", require("./src/orders/order.route"));
app.use("/api/auth", require("./src/users/user.route"));
app.use("/api/admin", require("./src/stats/admin.stats"));
app.use("/api/upload", require("./src/routes/uploadRoutes")); // ✅ Image uploads
app.use("/api/contact", require("./src/contact-form/contact-form.route"));

// ===============================
// 🌐 Default Health Check Route
// ===============================
app.get("/", (req, res) => {
  res.send("✅ Lina Optic e-commerce Server is running!");
});

// ===============================
// 🔌 Connect to MongoDB
// ===============================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    setTimeout(connectDB, 5000); // Retry after 5s if failed
  }
};
connectDB();

// ===============================
// 🚀 Start Express Server
// ===============================
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
