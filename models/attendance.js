const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Registration",
        },
        date: {
            type: Date,
        },
        status: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Attendance", AttendanceSchema);
