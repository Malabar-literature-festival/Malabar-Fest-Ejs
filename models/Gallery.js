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
        album: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Album'
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Gallery", GallerySchema);
