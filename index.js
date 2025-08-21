// ===============================
// 📦 Import Dependencies
// ===============================
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors"); // ✅ use proven CORS middleware
require("dotenv").config();

// ===============================
// 🚀 Initialize App
// ===============================
const app = express();
const port = process.env.PORT || 5000;
app.disable("x-powered-by");

// (optional, but good on Vercel/Proxies)
app.set("trust proxy", 1);

// ===============================
// 🌐 Allowed Origins for CORS
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
// 🛡️ CORS Middleware (handles preflight too)
//  - Answers OPTIONS 204 automatically
//  - Adds Vary: Origin to prevent caching bugs
//  - Limits to our allowedOrigins only
// ===============================
const corsOptions = {
  origin: function (origin, callback) {
    // allow same-origin / server-to-server with no Origin header
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Authorization", "Accept"],
  credentials: true,                 // keep true only if you use cookies/auth
  optionsSuccessStatus: 204,
};

// ✅ CORS must be before any routes
app.use((req, res, next) => {
  res.setHeader("Vary", "Origin");   // important for caches (CDN/browsers)
  next();
});
app.use(cors(corsOptions));
// explicitly handle preflight for all routes
app.options("*", cors(corsOptions));

// ===============================
// 🧾 Body Parsers
// ===============================
app.use(express.json({ limit: "10mb" }));
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
app.use("/api/upload", require("./src/routes/uploadRoutes"));
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
