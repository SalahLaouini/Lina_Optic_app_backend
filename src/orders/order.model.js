const mongoose = require("mongoose");

// 📦 Define the Order Schema
const OrderSchema = new mongoose.Schema(
  {
    // 🧑 Customer Information
    name: { type: String, required: true }, // Full name of the customer
    email: { type: String, required: true }, // Customer's email address
    phone: { type: String, required: true }, // Customer's phone number

    // 📍 Shipping Address
    address: {
      street: { type: String, required: true }, // Street name and number
      city: { type: String, required: true },   // City
      state: { type: String, required: true },  // State or governorate
      country: { type: String, required: true }, // Country
      zipcode: { type: String, required: true }, // Postal code
    },

    // 🛒 Ordered Products
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // 🔗 References the Product model
          required: true,
        },
        quantity: { type: Number, required: true }, // Quantity ordered for this product

        // 🎨 Color variant selected for the product
        color: {
          colorName: {
            en: { type: String, required: true }, // English name of the color
            fr: { type: String, required: true }, // French name of the color
            ar: { type: String, required: true }, // Arabic name of the color
          },
          image: { type: String, required: true }, // Main image URL for the selected color
        },
      },
    ],

    // 💰 Total Order Price
    totalPrice: { type: Number, required: true }, // Sum of all product prices × quantity

    // ✅ Order Status
    isPaid: { type: Boolean, default: false }, // Whether the order has been paid
    isDelivered: { type: Boolean, default: false }, // Whether the order has been delivered

    // 🔄 Product Progress Tracking (per product-color combo)
    productProgress: {
      type: Map,
      of: Number, // Each key is "productId|color", and the value is a number (e.g., 60 for 60%)
      default: {},
    },
  },
  { timestamps: true } // ⏱️ Adds createdAt and updatedAt fields automatically
);

// 🧾 Create the Order model
const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
