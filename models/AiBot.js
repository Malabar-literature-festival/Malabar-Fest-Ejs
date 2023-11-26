const mongoose = require("mongoose");

const AiBot = new mongoose.Schema(
  {
    assistantId: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    threadId: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AiBot", AiBot);
