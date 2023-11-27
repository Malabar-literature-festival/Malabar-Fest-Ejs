const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema(
  {
    day: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Day",
    },
    time: {
      type: String,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    isNote: {
      type: Boolean,
      default: false,
    },
    isFeedback: {
      type: Boolean,
      default: false,
    },
    isQnA: {
      type: Boolean,
      default: false,
    },
    isDetails: {
      type: Boolean,
      default: false,
    },
    orderId: {
      type: Number,
    },
    stage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stage",
    },
    sessionGuests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SessionGuest",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", SessionSchema);
