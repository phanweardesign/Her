const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        phone: {
            type: String,
            trim: true,
            default: ""
        },

        password: {
            type: String,
            required: true
        },

        isEmailVerified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

userSchema.index(
    { phone: 1 },
    {
        unique: true,
        partialFilterExpression: {
            phone: {
                $type: "string",
                $ne: ""
            }
        }
    }
);

module.exports = mongoose.model("User", userSchema);