const mongoose = require("mongoose");
const moment = require("moment");

const NotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    date: {
      type: Date,
      default: moment().toDate(),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("notification", NotificationSchema);
