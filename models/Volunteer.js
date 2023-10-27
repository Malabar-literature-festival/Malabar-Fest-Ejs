const mongoose = require("mongoose");

// Define the schema for volunteer registration
const volunteerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gender : {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    institute: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    workType: {
        type: String,
        required: true
    },
    timeSlot: {
        type: String,
        required: true
    },
    reference: {
        name : {type: String},
        contact: {type: String}
    },
    regDate: [
        {
          type: Date,
        },
      ],
    matterOfInterest: {
        type: [String],
        required: true,
    },
    image: {
        type: String,
        required: true,
    }
});

// Create and export the Volunteer model
module.exports = mongoose.model("Volunteer", volunteerSchema);
