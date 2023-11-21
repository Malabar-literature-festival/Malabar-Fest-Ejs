const mongoose = require("mongoose");
const moment = require("moment");

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
    date: {
      type: Date,
      default: moment().toDate(), // Use moment to set the default date
    },
  },
  { timestamps: true }
);

// Virtual property for formatted date
NoteSchema.virtual("formattedDate").get(function () {
  return moment(this.date).format("MMMM Do YYYY, h:mm:ss a");
});

module.exports = mongoose.model("Note", NoteSchema);
