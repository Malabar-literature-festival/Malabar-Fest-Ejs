const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
    },
    notes: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", NoteSchema);
