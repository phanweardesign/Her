const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 40 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    isEmailVerified: { type: Boolean, default: false },

    passwordResetCodeHash: { type: String, default: null, select: false },
    passwordResetExpiresAt: { type: Date, default: null, select: false },
    passwordResetAttempts: { type: Number, default: 0, select: false },
    passwordResetLastSentAt: { type: Date, default: null, select: false }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
