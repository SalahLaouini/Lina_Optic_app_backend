const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// ✅ Define the User schema
const userSchema = new mongoose.Schema({
    // 🧑 Username (must be unique and required)
    username: {
        type: String,
        required: true,
        unique: true
    },
    // 🔒 Password (required)
    password: {
        type: String,
        required: true
    },
    // 🛡️ Role can only be 'user' or 'admin'
    role: {
        type: String,
        enum: ['user', 'admin'],
        required: true
    }
});

// 🔁 Pre-save hook to hash the password before saving
userSchema.pre('save', async function(next) {
    // ⏩ If password is not modified, skip hashing
    if (!this.isModified('password')) return next();

    // 🔐 Hash the password with bcrypt (saltRounds = 10)
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// ✅ Create the User model
const User = mongoose.model('User', userSchema);

// 📤 Export the model for use in other files
module.exports = User;
