const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        image: {
            type: String,
        },
        language: {
            type: String,
            // enum: ["English", "Arabic", "Urdu"]
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Gallery", GallerySchema);
