const mongoose = require("mongoose");

/*
 * Her keeps the complete client book shape inside payload so existing IDs,
 * chapters, characters, world data, notes, and future fields survive without
 * Mongoose casting or silently dropping anything.
 */
const bookSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        clientId: {
            type: String,
            required: true,
            trim: true
        },
        payload: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        }
    },
    { timestamps: true }
);

bookSchema.index({ user: 1, clientId: 1 }, { unique: true });

module.exports = mongoose.model("Book", bookSchema);
