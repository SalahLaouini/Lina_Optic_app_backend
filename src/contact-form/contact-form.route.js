// 📦 Import required modules
const express = require("express");
const router = express.Router();

// 📬 Import the controller function
const { sendContactEmail } = require("./contact-form.controller");

// 🛡️ Optional: Middleware to prevent abuse (e.g., rate limiting or input sanitization)
// You can add middleware here if needed (e.g., express-rate-limit)

// 🛣️ Define the route for sending contact form emails
// URL: /api/contact (POST request)
router.post("/", sendContactEmail);

// 📤 Export the router to be used in your main backend app
module.exports = router;
