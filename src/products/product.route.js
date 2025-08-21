// ==========================================
// 📦 Product Routes - product.route.js
// ==========================================

const express = require('express');
const router = express.Router();

// ✅ Import the entire product controller object
const productController = require('./product.controller');

// 🔐 Middleware to verify admin access for protected routes
const verifyAdminToken = require('../middleware/verifyAdminToken');

// ==========================================
// ✅ ROUTES
// ==========================================

// ✅ POST - Create a new product (admin only)
router.post(
  "/create-product",
  verifyAdminToken,
  productController.postAProduct
);

// ✅ GET - Fetch all products (public route)
router.get(
  "/",
  productController.getAllProducts
);

// ✅ GET - Fetch a single product by its ID (public route)
router.get(
  "/:id",
  productController.getSingleProduct
);

// ✅ PUT - Update an existing product by ID (admin only)
router.put(
  "/edit/:id",
  verifyAdminToken,
  productController.updateProduct
);

// ✅ DELETE - Remove a product by ID (admin only)
router.delete(
  "/:id",
  verifyAdminToken,
  productController.deleteAProduct
);

// ✅ PUT - Update product price by a percentage (admin only)
router.put(
  "/update-price/:id",
  verifyAdminToken,
  productController.updateProductPriceByPercentage
);

// 📤 Export the router to be used in the main server
module.exports = router;
