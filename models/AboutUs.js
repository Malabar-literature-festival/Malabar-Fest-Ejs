const mongoose = require("mongoose");

const AboutUsSchema = new mongoose.Schema(
  {
    vision: {
      type: String,
    },
    mission: {
      type: String,
    },
    shortDescription: {
      type: String,
    },
    longDescription: {
      type: String,
    },
    language: {
      type: String,
      // enum: ["English", "Arabic", "Urdu"]
    },
    aboutMlf: {
      type: String,
    },
    aboutBookPlus: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AboutUs", AboutUsSchema);