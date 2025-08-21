// ✅ Import the Cloudinary v2 SDK
const cloudinary = require("cloudinary").v2;

// ✅ Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // 🔐 Cloud name from your Cloudinary account
  api_key: process.env.CLOUDINARY_API_KEY,       // 🔐 API key for authentication
  api_secret: process.env.CLOUDINARY_API_SECRET, // 🔐 API secret for secure access
});

// ✅ Export the configured Cloudinary instance to use in upload routes
module.exports = cloudinary;
