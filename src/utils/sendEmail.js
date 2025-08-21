// ✅ Import Nodemailer for sending emails
const nodemailer = require("nodemailer");

// ✅ Function to send an email using Nodemailer
const sendEmail = async (to, subject, html) => {
  // ✅ Create a transporter using Gmail SMTP settings
  const transporter = nodemailer.createTransport({
    service: "gmail", // 📬 Use Gmail as the email service
    auth: {
      user: process.env.EMAIL_USER, // 🔐 Sender email (from environment variable)
      pass: process.env.EMAIL_PASS, // 🔐 App-specific password (not the regular Gmail password)
    },
    tls: {
      rejectUnauthorized: false, // ⚠️ Allow self-signed certificates (helpful for development)
    },
  });

  // ✅ Define the email content and recipient
  const mailOptions = {
    from: `"Lina Optic" <${process.env.EMAIL_USER}>`, // 📤 Sender info
    to,            // 📥 Recipient email address
    subject,       // 📌 Email subject
    html,          // 📝 Email HTML content
  };

  // ✅ Send the email and return the result (Promise)
  return transporter.sendMail(mailOptions);
};

// ✅ Export the function for use in other files
module.exports = sendEmail;
