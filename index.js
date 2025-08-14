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
app.disable("x-powered-by");

// ===============================
// 🌐 Define Allowed Origins for CORS
// ===============================
const allowedOrigins = (process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [
      "http://localhost:5173",
      "https://lina-optic-app-frontend-khav.vercel.app",
      "https://lina-optic-app-frontend.vercel.app",
      "https://linaoptic.com",
      "https://www.linaoptic.com",
    ]).map((o) => o.trim());

// ===============================
// 🛡️ CORS Middleware (Dynamic Origin Support)
//  - Adds PATCH
//  - Answers OPTIONS with 204
//  - Allows common headers
// ===============================
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Authorization, Accept"
  );

  // ✅ Always handle preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// ===============================
// 🧾 Body Parsers
// ===============================
app.use(express.json({ limit: "10mb" })); // allow larger JSON bodies if needed
app.use(express.urlencoded({ extended: true }));

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
