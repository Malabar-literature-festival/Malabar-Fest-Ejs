const mongoose = require("mongoose");

const AiBot = new mongoose.Schema(
  {
    assistantId: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    threadId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AiBot", AiBot);
