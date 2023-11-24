const mongoose = require("mongoose");

const DaySchema = new mongoose.Schema(
  {
    day: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Day", DaySchema);
  