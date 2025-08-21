// ===============================
// 📦 Import Dependencies
// ===============================
const express = require("express");
const router = express.Router();

// ✅ Import upload middleware and controller
const { upload, uploadImage } = require("../controllers/uploadController");

// ===============================
// 📤 POST /api/upload
// ===============================
// This route handles a single image upload from memory to Cloudinary
// The frontend must send the image in a FormData under the field name "image"
router.post("/", upload.single("image"), uploadImage);

// ===============================
// 📤 Export the router
// ===============================
module.exports = router;
