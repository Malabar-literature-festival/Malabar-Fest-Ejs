const mongoose = require("mongoose");
const moment = require("moment");

const qnaSchema = new mongoose.Schema(
  {
    question: {
      type: String,
    },
    answer: {
      type: String,
    },
    date: {
      type: Date,
      default: moment().toDate(), // Use moment to set the default date
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
    },
  },
  { timestamps: true }
);

qnaSchema.virtual("formattedDate").get(function () {
  return moment(this.date).format("MMMM Do YYYY, h:mm:ss a");
});

module.exports = mongoose.model("qna", qnaSchema);
