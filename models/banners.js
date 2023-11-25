const mongoose = require("mongoose");

const BannersSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        image: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Banners", BannersSchema);
