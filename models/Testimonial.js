const mongoose = require("mongoose");

const TestimonialSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        content: {
            type: String,
        },
        image: {
            type: String,
        },
        author: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Testimonial", TestimonialSchema);
