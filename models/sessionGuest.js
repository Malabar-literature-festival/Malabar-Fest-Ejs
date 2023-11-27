const mongoose = require("mongoose");

const SessionGuestSchema = new mongoose.Schema(
  {
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Speakers",
    },
    order: {
      type: Number,
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
    },
    guestRole: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GuestRole",
    },
    photo: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SessionGuest", SessionGuestSchema);