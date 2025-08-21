// 📦 Import Nodemailer to handle email sending
const nodemailer = require("nodemailer");
// 🔐 Load environment variables from .env file
require("dotenv").config();

// ✅ Create and configure the Nodemailer transporter for Gmail
const transporter = nodemailer.createTransport({
  service: "gmail", // Use Gmail as the email service
  auth: {
    user: process.env.EMAIL_USER, // ✅ Your Gmail address (from .env)
    pass: process.env.EMAIL_PASS, // ✅ Gmail app password (not regular password)
  },
});

// 📨 Controller to process contact form submissions
const sendContactEmail = async (req, res) => {
  // 🧾 Extract data from the submitted form
  const { name, email, subject, message } = req.body;

  // 🔎 Validate input: all fields must be filled
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "🚫 Tous les champs sont obligatoires. Veuillez vérifier le formulaire.",
    });
  }

  try {
    // 🖋️ Format the email content in HTML
    const htmlContent = `
      <h2 style="color:#2a4eaa;">📩 Nouveau message de contact</h2>
      <p><strong>👤 Nom :</strong> ${name}</p>
      <p><strong>📧 Email :</strong> ${email}</p>
      <p><strong>🎯 Sujet :</strong> ${subject}</p>
      <p><strong>💬 Message :</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
      <hr/>
      <p style="font-size:0.9rem; color:#888;">Ce message a été envoyé depuis le site Lina Optic.</p>
    `;

    // 📤 Send the email via the transporter
    await transporter.sendMail({
      from: `"${name}" <${email}>`,                 // Display name and email of sender
      to: process.env.EMAIL_USER,                   // Recipient: your admin/support email
      subject: `📬 Nouveau message : ${subject}`,   // Email subject line
      html: htmlContent,                            // HTML body content
    });

    // ✅ Respond with success
    res.status(200).json({
      success: true,
      message: "✅ Merci ! Votre message a bien été envoyé. Nous vous répondrons rapidement.",
    });
  } catch (error) {
    // ❌ Handle email sending errors
    console.error("❌ Échec de l'envoi de l'email :", error.message);
    res.status(500).json({
      success: false,
      message: "❌ Une erreur est survenue lors de l'envoi du message. Veuillez réessayer plus tard.",
    });
  }
};

// 📤 Export the controller function for use in routes
module.exports = { sendContactEmail };
