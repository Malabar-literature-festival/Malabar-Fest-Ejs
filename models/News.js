const mongoose = require("mongoose");

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

// Middleware to automatically generate and set the slug when saving a news article
NewsSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model("News", NewsSchema);
