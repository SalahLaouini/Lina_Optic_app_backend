const mongoose = require("mongoose");

// ✅ Color schema with multilingual colorName and multiple images
const ColorSchema = new mongoose.Schema({
  // 🎨 Multilingual color name
  colorName: {
    en: { type: String, required: true }, // English color name
    fr: { type: String, required: true }, // French color name
    ar: { type: String, required: true }, // Arabic color name
  },
  // 🖼️ Array of images for this color variation (e.g., front view, side view)
  images: [{ type: String, required: true }], 

  // 📦 Stock quantity for this color variation
  stock: { type: Number, required: true, default: 0 }, 
});

// ✅ Product schema
const ProductSchema = new mongoose.Schema(
  {
    // 🏷️ Default title and description (used as fallback)
    title: { type: String, required: true },
    description: { type: String, required: true },

    // 🌐 Translations of the title and description (EN / FR / AR)
    translations: {
      en: { title: String, description: String },
      fr: { title: String, description: String },
      ar: { title: String, description: String },
    },

    // 🗂️ Categories (main and sub)
    mainCategory: { type: String, required: true },  // e.g., Hommes, Femmes
    subCategory: { type: String, required: true },   // e.g., Optique, Solaire

    // 🕶️ Frame type (optional field for glasses)
    frameType: { type: String, required: false }, // e.g., Cadre rond, Demi-cadre

    // 🖼️ Default cover image (used in product cards or preview)
    coverImage: { type: String, required: true },

    // 🎨 Color variations with their images and stock levels
    colors: {
      type: [ColorSchema],
      required: true,
    },

    // 🏢 Product brand (optional)
    brand: { type: String, required: false },

    // 💸 Prices
    oldPrice: { type: Number, required: true }, // Original price (before discount)
    newPrice: { type: Number, required: true }, // Current discounted price

    // 📦 Total stock across all colors
    stockQuantity: { type: Number, required: true },

    // 🌟 Trending badge (used to highlight selected products)
    trending: { type: Boolean, default: false },
  },
  { timestamps: true } // ⏱️ Automatically adds createdAt and updatedAt
);

// 📤 Export the Product model
module.exports = mongoose.model("Product", ProductSchema);
