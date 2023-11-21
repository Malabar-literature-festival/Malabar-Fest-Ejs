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

// Adding a virtual field to get createdAt in IST
NoteSchema.virtual('createdAtIST').get(function() {
  return this.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
});

module.exports = mongoose.model("Note", NoteSchema);
