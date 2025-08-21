const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./user.model");
const admin = require("../utils/firebaseAdmin"); // 🔐 Firebase Admin SDK instance

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

/**
 * ✅ Admin Login (MongoDB only)
 * This route authenticates an admin using stored credentials in MongoDB.
 */
router.post("/admin", async (req, res) => {
  const { username, password } = req.body;

  try {
    // 🔍 Find user by username
    const adminUser = await User.findOne({ username });
    if (!adminUser) {
      return res.status(404).json({ message: "Admin not found!" });
    }

    // ❗ Password check (plaintext comparison)
    // NOTE: In production, use bcrypt.compare for security
    const isPasswordValid = adminUser.password === password;
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password!" });
    }

    // 🪙 Generate JWT token with role and username
    const token = jwt.sign(
      { id: adminUser._id, username: adminUser.username, role: adminUser.role },
      JWT_SECRET,
      { expiresIn: "30d" } // Token valid for 30 days
    );

    // ✅ Send back auth info
    return res.status(200).json({
      message: "Authentication successful",
      token,
      user: {
        username: adminUser.username,
        role: adminUser.role,
      },
    });

  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({ message: "Failed to login as admin" });
  }
});

/**
 * ✅ Count MongoDB Admin Users
 * Returns the total number of admin users stored in MongoDB.
 */
router.get("/admin/users/count", async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({ totalUsers: count });
  } catch (error) {
    console.error("User count error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ✅ Firebase: Send Reset Password Email to Firebase Users
 * This route sends a password reset email using Firebase Auth and a custom email template.
 */
const sendEmail = require("../utils/sendEmail");
 // ✅ Add this at the top if not already

router.post("/reset-password-request", async (req, res) => {
  const { email } = req.body;

  try {
    const resetLink = await admin.auth().generatePasswordResetLink(email, {
      url: "https://lina-optic-app-frontend.vercel.app/reset-password"
    });

    const subject = "🔐 Réinitialisation de votre mot de passe - Lina Optic";
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #c9202a;">Réinitialisation de mot de passe</h2>
        <p>Bonjour,</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe. Pour continuer, veuillez cliquer sur le lien ci-dessous :</p>
        <p style="margin: 20px 0;">
          <a href="${resetLink}" style="background-color: #c9202a; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;" target="_blank">
            Réinitialiser le mot de passe
          </a>
        </p>
        <p>⚠️ Ce lien est valable pendant une durée limitée (1 heure). Si vous n'avez pas fait cette demande, vous pouvez ignorer ce message en toute sécurité.</p>
        <br />
        <p>Merci pour votre confiance,<br><strong>L'équipe Lina Optic</strong></p>
      </div>
    `;

    await sendEmail(email, subject, html);

    res.status(200).json({
      message: "📩 Un email de réinitialisation a été envoyé. Veuillez vérifier votre boîte de réception."
    });
  } catch (error) {
    console.error("❌ Firebase reset email error:", error.message);
    res.status(404).json({
      message: "❌ Unable to send reset email. Please check the email address or try again later."
    });
  }
});


module.exports = router;





