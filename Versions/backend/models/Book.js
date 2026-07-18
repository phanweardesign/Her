const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
    title: { type: String, default: "Chapter" },
    content: { type: String, default: "" },
    status: { type: String, default: "Draft" },
    characters: [{ type: mongoose.Schema.Types.ObjectId }],
    locations: [{ type: mongoose.Schema.Types.ObjectId }]
}, { timestamps: true });

const bookSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        genre: {
            type: String,
            default: ""
        },

        description: {
            type: String,
            default: ""
        },

        chapters: [chapterSchema],

        characters: {
            type: Array,
            default: []
        },

        locations: {
            type: Array,
            default: []
        },

        organizations: {
            type: Array,
            default: []
        },

        artifacts: {
            type: Array,
            default: []
        },

        magic: {
            type: Array,
            default: []
        },

        timeline: {
            type: Array,
            default: []
        },

        notes: {
            type: Array,
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Book", bookSchema);