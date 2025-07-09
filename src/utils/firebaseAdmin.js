// src/utils/firebaseAdmin.js ✅ Fully CommonJS-Compatible

// ✅ Import the Firebase Admin SDK
const admin = require("firebase-admin");

// ✅ Parse the Firebase service account key from environment variable
const firebaseKey = JSON.parse(process.env.FIREBASE_ADMIN_KEY);

// ✅ Fix escaped newlines in private_key (replace \\n with actual line breaks)
firebaseKey.private_key = firebaseKey.private_key.replace(/\\n/g, "\n");

// ✅ Initialize Firebase Admin SDK (only once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseKey), // 🔐 Service account
  });
}

// ✅ Export the initialized admin instance
module.exports = admin;
