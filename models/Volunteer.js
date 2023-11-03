const mongoose = require("mongoose");

// Define the schema for volunteer registration
const volunteerSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  gender: {
    type: String,
  },
  mobile: {
    type: String,
  },
  email: {
    type: String,
  },
  institute: {
    type: String,
  },
  category: {
    type: String,
  },
  place: {
    type: String,
  },
  age: {
    type: Number,
  },
  workType: {
    type: String,
  },
  timeSlot: {
    type: String,
  },
  reference: {
    name: { type: String },
    contact: { type: String },
  },
  regDate: [
    {
      type: Date,
    },
  ],
  matterOfInterest: {
    type: [String],
  },
  image: {
    type: String,
  },
});

// Create and export the Volunteer model
module.exports = mongoose.model("Volunteer", volunteerSchema);
