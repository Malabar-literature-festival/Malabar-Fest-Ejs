const mongoose = require("mongoose");
const slugify = require("slugify");

const NewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    date: {
      type: Date,
    },
    image: {
      type: String,
    },
    language: {
      type: String,
      // enum: ["English", "Arabic", "Urdu"]
    },
    slug: {
      type: String,
      unique: true, // Ensure slugs are unique
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("News", NewsSchema);
