const express = require('express');
const Order = require('../orders/order.model');          // 📦 Mongoose model for orders
const Product = require('../products/product.model');    // 🛍️ Mongoose model for products
const User = require('../users/user.model.js');          // 👤 Mongoose model for MongoDB users
const firebaseAdmin = require('../utils/firebaseAdmin'); // 🔐 Firebase Admin SDK instance

const router = express.Router();

// ✅ Route: GET /api/admin/stats
// 📊 Fetch total orders, sales, products, users (MongoDB + Firebase), monthly sales, and trending products
router.get("/", async (req, res) => {
  try {
    // 📦 Count total number of orders
    const totalOrders = await Order.countDocuments();

    // 🛍️ Count total number of products
    const totalProducts = await Product.countDocuments();

    // 👥 Count total number of MongoDB users
    const totalUsersMongo = await User.countDocuments();

    // 💰 Calculate total revenue from all orders using aggregation
    const totalSalesAgg = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalPrice" } // ⬅️ Sum of totalPrice field
        }
      }
    ]);
    const totalSales = totalSalesAgg[0]?.totalSales || 0; // 💡 Fallback to 0 if empty

    // 🔥 Count number of trending products (where trending: true)
    const trendingProductsAgg = await Product.aggregate([
      { $match: { trending: true } },
      { $count: "trendingProductsCount" }
    ]);
    const trendingProducts = trendingProductsAgg[0]?.trendingProductsCount || 0;

    // 📅 Monthly sales aggregation: Group by year-month
    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, // Group by month
          totalSales: { $sum: "$totalPrice" },
          totalOrders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } } // 📊 Sort by month ascending
    ]);

    // 🔐 Fetch users from Firebase Auth (limit to 1000 users max)
    const firebaseUsers = await firebaseAdmin.auth().listUsers(1000);
    const totalUsersFirebase = firebaseUsers.users.length;

    // 👥 Combine MongoDB and Firebase users
    const totalUsers = totalUsersMongo + totalUsersFirebase;

    // ✅ Send all stats in response
    res.status(200).json({
      totalOrders,
      totalSales,
      trendingProducts,
      totalProducts,
      monthlySales,
      totalUsers, // 👥 Combined total users
    });

  } catch (error) {
    // ❌ Handle server error
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
});

module.exports = router;
