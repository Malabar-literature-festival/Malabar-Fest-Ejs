const mongoose = require("mongoose");

const AlbumSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        images: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Gallery'
            }
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Album", AlbumSchema);

