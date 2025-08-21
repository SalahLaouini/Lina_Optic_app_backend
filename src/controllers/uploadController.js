// 📦 Required modules
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// ✅ Cloudinary configuration (use environment variables for security)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,     // e.g. "my-cloud"
  api_key: process.env.CLOUDINARY_API_KEY,           // e.g. "1234567890"
  api_secret: process.env.CLOUDINARY_API_SECRET,     // e.g. "my-secret"
});

// ✅ Use in-memory storage (required on Vercel)
const storage = multer.memoryStorage();

// ✅ Multer upload middleware
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const isValid = allowedTypes.test(file.mimetype.toLowerCase());
    if (isValid) cb(null, true);
    else cb(new Error("Only JPEG, PNG, and WEBP images are allowed."));
  },
});

// 📤 Upload image to Cloudinary from buffer
const uploadImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file provided." });
    }

    // Convert buffer to stream and upload to Cloudinary
    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "lina-optic" }, // Optional folder
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });

    const result = await streamUpload();

    // ✅ Return uploaded image URL
    res.status(200).json({
      message: "Image uploaded successfully.",
      image: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);
    res.status(500).json({ error: "Image upload failed." });
  }
};

// 📤 Export the multer middleware and route handler
module.exports = {
  upload,
  uploadImage,
};
