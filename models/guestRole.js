const mongoose = require("mongoose");

const GuestRoleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("GuestRole", GuestRoleSchema);
