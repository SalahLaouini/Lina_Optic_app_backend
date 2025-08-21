const Product = require("./product.model");
const translate = require("translate-google");

// ✅ Helper function to translate text to a target language
const translateDetails = async (text, lang) => {
  try {
    return await translate(text, { to: lang });
  } catch (error) {
    console.error(`Translation error (${lang}):`, error);
    return text; // Fallback to original
  }
};

// ✅ Create a New Product with auto translations (title, desc, color names)
const postAProduct = async (req, res) => {
  try {
    let {
      title,
      description,
      mainCategory,
      subCategory,
      frameType,
      brand,
      newPrice,
      oldPrice,
      colors,
      trending,
    } = req.body;

    // ✅ Validate input categories
    const validMainCategories = ["Hommes", "Femmes", "Enfants"];
    const validSubCategories = ["Optique", "Solaire", "Lentilles"];
    const validFrameTypes = [
      "Plein cadre",
      "Demi-cadre (semi-cerclé)",
      "Sans cadre (invisible)",
      "Cadre en plastique",
      "Cadre en métal",
      "Cadre rond",
      "Cadre carré",
      "Cadre rectangulaire",
      "Cadre papillon",
      "Cadre aviateur",
      "Cadre ovale",
    ];

    if (!validMainCategories.includes(mainCategory)) {
      return res.status(400).json({ success: false, message: "❌ Invalid main category." });
    }

    if (!validSubCategories.includes(subCategory)) {
      return res.status(400).json({ success: false, message: "❌ Invalid sub category." });
    }

    if (frameType && !validFrameTypes.includes(frameType)) {
      return res.status(400).json({ success: false, message: "❌ Invalid frame type." });
    }

    if (!Array.isArray(colors) || colors.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one color must be provided.",
      });
    }

    // ✅ Translate color names and structure images array
    const translatedColors = await Promise.all(
      colors.map(async (color) => {
        const baseColor =
          typeof color.colorName === "object" ? color.colorName.en : color.colorName;

        return {
          colorName: {
            en: baseColor,
            fr: await translateDetails(baseColor, "fr"),
            ar: await translateDetails(baseColor, "ar"),
          },
          images: Array.isArray(color.images) ? color.images : [color.image],
          stock: Number(color.stock) || 0,
        };
      })
    );

    // ✅ Set cover image from the first image of the first color
    const coverImage = translatedColors[0]?.images?.[0] || "";

    // ✅ Translate product title & description
    const translations = {
      en: { title, description },
      fr: {
        title: await translateDetails(title, "fr"),
        description: await translateDetails(description, "fr"),
      },
      ar: {
        title: await translateDetails(title, "ar"),
        description: await translateDetails(description, "ar"),
      },
    };

    const stockQuantity = translatedColors[0]?.stock || 0;

    // ✅ Construct product data
    const productData = {
      title,
      description,
      translations,
      mainCategory,
      subCategory,
      frameType,
      coverImage,
      colors: translatedColors,
      brand,
      oldPrice,
      newPrice,
      stockQuantity,
      trending,
    };

    // ✅ Save to database
    const newProduct = new Product(productData);
    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "✅ Produit ajouté avec succès",
      product: newProduct,
    });
  } catch (error) {
    console.error("❌ Error creating product:", error);
    res.status(500).json({ success: false, message: "Failed to create product" });
  }
};


// ✅ Get All Products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
};

// ✅ Get a Single Product by ID
const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found!" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ success: false, message: "Failed to fetch product" });
  }
};

// ✅ Update Product with auto translations
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    let {
      title,
      description,
      mainCategory,
      subCategory,
      frameType,
      newPrice,
      oldPrice,
      brand,
      colors,
      trending,
    } = req.body;

    // ✅ Validation
    const validMainCategories = ["Hommes", "Femmes", "Enfants"];
    const validSubCategories = ["Optique", "Solaire", "Lentilles"];
    const validFrameTypes = [
      "Plein cadre",
      "Demi-cadre (semi-cerclé)",
      "Sans cadre (invisible)",
      "Cadre en plastique",
      "Cadre en métal",
      "Cadre rond",
      "Cadre carré",
      "Cadre rectangulaire",
      "Cadre papillon",
      "Cadre aviateur",
      "Cadre ovale",
    ];

    if (!validMainCategories.includes(mainCategory)) {
      return res.status(400).json({ success: false, message: "❌ Invalid main category." });
    }

    if (!validSubCategories.includes(subCategory)) {
      return res.status(400).json({ success: false, message: "❌ Invalid sub category." });
    }

    if (frameType && !validFrameTypes.includes(frameType)) {
      return res.status(400).json({ success: false, message: "❌ Invalid frame type." });
    }

    if (!Array.isArray(colors) || colors.length === 0) {
      return res.status(400).json({ success: false, message: "At least one color is required." });
    }

    // ✅ Translate colors
    const translatedColors = await Promise.all(
      colors.map(async (color) => {
        const baseColor =
          typeof color.colorName === "object" ? color.colorName.en : color.colorName;

        return {
          colorName: {
            en: baseColor,
            fr: await translateDetails(baseColor, "fr"),
            ar: await translateDetails(baseColor, "ar"),
          },
          images: Array.isArray(color.images) ? color.images : [color.image],
          stock: Number(color.stock) || 0,
        };
      })
    );

    const coverImage = translatedColors[0]?.images?.[0] || "";
    const stockQuantity = translatedColors[0]?.stock || 0;

    // ✅ Translate product title & description
    const translations = {
      en: { title, description },
      fr: {
        title: await translateDetails(title, "fr"),
        description: await translateDetails(description, "fr"),
      },
      ar: {
        title: await translateDetails(title, "ar"),
        description: await translateDetails(description, "ar"),
      },
    };

    const updatedProductData = {
      title,
      description,
      translations,
      mainCategory,
      subCategory,
      frameType,
      coverImage,
      colors: translatedColors,
      brand,
      oldPrice,
      newPrice,
      stockQuantity,
      trending,
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedProductData, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "✅ Produit mis à jour avec succès",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ success: false, message: "Failed to update product" });
  }
};



// ✅ Delete a Product
const deleteAProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found!" });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "Failed to delete product" });
  }
};

// ✅ Update product price by percentage
const updateProductPriceByPercentage = async (req, res) => {
  const { id } = req.params;
  const { percentage } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found!" });
    }

    const discount = (product.oldPrice * percentage) / 100;
    product.finalPrice = product.oldPrice - discount;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Price updated successfully",
      finalPrice: product.finalPrice,
    });
  } catch (error) {
    console.error("Error updating product price:", error);
    res.status(500).json({ success: false, message: "Failed to update product price" });
  }
};

module.exports = {
  postAProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteAProduct,
  updateProductPriceByPercentage,
};




