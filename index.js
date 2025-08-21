// ===============================
// 📦 Import Dependencies
// ===============================
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

// ===============================
// 🚀 Initialize App
// ===============================
const app = express();
const port = process.env.PORT || 5000;
app.disable("x-powered-by");
app.set("trust proxy", 1);

// ===============================
// 🌐 Allowed Origins for CORS
//    (env wins; spaces around commas tolerated)
// ===============================
const allowedOrigins = (
  process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(/\s*,\s*/)
    : [
        "http://localhost:5173",
        "https://lina-optic-app-frontend-khav.vercel.app",
        "https://lina-optic-app-frontend.vercel.app",
        "https://linaoptic.com",
        "https://www.linaoptic.com",
      ]
).map((o) => o.trim());

// ===============================
// 🛡️ CORS
// ===============================
const corsOptions = {
  origin(origin, callback) {
    // allow requests without Origin (curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Authorization", "Accept"],
  credentials: true, // set false if you never use cookies
  optionsSuccessStatus: 204,
};

// Add Vary early to avoid cache-related CORS bugs
app.use((req, res, next) => {
  res.setHeader("Vary", "Origin");
  next();
});

// Apply CORS before routes
app.use(cors(corsOptions));
// Handle preflight for all routes
app.options("*", cors(corsOptions));

// Always echo ACAO for allowed origins (even on 404/500)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  next();
});

// ===============================
// 🧾 Body Parsers
// ===============================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ===============================
// 📁 Static (uploads)
// ===============================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===============================
// 🔗 Routes
// ===============================
app.use("/api/products", require("./src/products/product.route"));
app.use("/api/orders", require("./src/orders/order.route"));
app.use("/api/auth", require("./src/users/user.route"));
app.use("/api/admin", require("./src/stats/admin.stats"));
app.use("/api/upload", require("./src/routes/uploadRoutes"));
app.use("/api/contact", require("./src/contact-form/contact-form.route"));

// ===============================
// 🩺 Health
// ===============================
app.get("/", (_req, res) => {
  res.send("✅ Lina Optic e-commerce Server is running!");
});

// ===============================
// 🗄️ MongoDB
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
    setTimeout(connectDB, 5000);
  }
};
connectDB();

// ===============================
// ▶️ Start
// ===============================
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
