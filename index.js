// ===============================
// 📦 Import Dependencies
// ===============================
const express = require("express");
const cors = require("cors");
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
      "https://linaoptic.com"
    ];

// ===============================
// 🛡️ Apply CORS Middleware
// ===============================
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// ✅ Handle CORS Preflight Requests Globally
app.options("*", cors());

// ===============================
// 🧾 Middleware
// ===============================
app.use(express.json()); // Parse incoming JSON requests

// ✅ Serve Static Files (Uploaded Images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===============================
// 🔗 API Route Registrations
// ===============================
app.use("/api/products", require("./src/products/product.route"));
app.use("/api/orders", require("./src/orders/order.route"));
app.use("/api/auth", require("./src/users/user.route"));
app.use("/api/admin", require("./src/stats/admin.stats"));
app.use("/api/upload", require("./src/routes/uploadRoutes")); // ✅ Fixed path for image uploads
app.use("/api/contact", require("./src/contact-form/contact-form.route"));

// ===============================
// 🌐 Default Root Route
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
    setTimeout(connectDB, 5000); // Retry connection after 5 seconds
  }
};
connectDB();

// ===============================
// 🚀 Start Express Server
// ===============================
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
