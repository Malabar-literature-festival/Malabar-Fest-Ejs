const mongoose = require("mongoose");

const SessionGuestSchema = new mongoose.Schema(
  {
    guest: {
      type: String,
    },
    description: {
      type: String,
    },
    order: {
      type: Number,
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
    },
    photo: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SessionGuest", SessionGuestSchema);