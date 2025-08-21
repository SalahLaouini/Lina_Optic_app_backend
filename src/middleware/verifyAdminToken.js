// ==============================================
// 🔐 Middleware: verifyAdminToken.js
// ✅ Purpose: Protect admin-only routes by verifying JWT tokens
// ==============================================

const jwt = require("jsonwebtoken");
const User = require("../users/user.model"); // Adjust the path if needed

// ✅ Load the secret key used to sign the JWT tokens
const JWT_SECRET = process.env.JWT_SECRET_KEY;

// ✅ Middleware function to verify if the token belongs to an admin user
const verifyAdminToken = async (req, res, next) => {
  try {
    // 🔍 Extract token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    // ❌ If no token is provided, deny access
    if (!token) {
      return res.status(401).json({ message: "Access Denied. No token provided" });
    }

    // 🔓 Verify the token using the secret key
    const decoded = jwt.verify(token, JWT_SECRET);

    // 🔄 Retrieve the user associated with the token
    const user = await User.findById(decoded.id);

    // ❌ Check if user exists and is an admin
    if (!user || user.role.toLowerCase() !== 'admin') {
      return res.status(403).json({ message: "Access Denied. Admins only" });
    }

    // ✅ Attach user object to the request for later use
    req.user = user;

    // ⏭️ Pass control to the next middleware or route handler
    next();
  } catch (err) {
    console.error("Error in verifyAdminToken middleware:", err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// 📤 Export the middleware to use in routes
module.exports = verifyAdminToken;
