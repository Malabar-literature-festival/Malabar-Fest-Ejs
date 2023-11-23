const mongoose = require("mongoose");

const StageSchema = new mongoose.Schema(
    {
        stage: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Stage", StageSchema);
