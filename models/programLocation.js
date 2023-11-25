const mongoose = require("mongoose");

const ProgramLocationSchema = new mongoose.Schema(
    {
        location: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ProgramLocation", ProgramLocationSchema);
