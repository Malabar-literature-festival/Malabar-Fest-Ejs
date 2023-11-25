const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        date: {
            type: Date,
        },
        author: {
            type: String,
        },
        image: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Article", ArticleSchema);
