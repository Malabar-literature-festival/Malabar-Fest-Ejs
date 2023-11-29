const mongoose = require("mongoose");

const StageSchema = new mongoose.Schema(
    {
        stage: {
            type: String,
        },
        order: {
            type: Number,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Stage", StageSchema);
