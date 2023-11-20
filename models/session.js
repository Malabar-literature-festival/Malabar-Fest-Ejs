const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema(
  {
    day: {
      type: String,
    },
    time: {
      type: String,
    },
    title: {
      type: String,
    },
    stage: {
      type: String,
      // enum: ["Stage 1", "Stage 2", "Stage 3"]
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", SessionSchema);