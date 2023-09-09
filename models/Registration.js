const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        mobileNumber: {
            type: String,
        },
        email: {
            type: String,
        },
        password: {
            type: String,
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
        },
        address: {
            type: String,
        },
        district: {
            type: String,
        },
        profession: {
            type: String,
        },
        category: {
            type: String,
        },
        institution: {
            type: String,
        },
        matterOfInterest: {
            type: String,
        },
        regType: {
            type: String,
            enum: ["attende", "delegate", "student"],
        },
        regDate: {
            type: Date,
        },
        commonReg: {
            type: String,
            enum: ["commonReg"],
        },
        regRef: {
            type: String,
        },
        image: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Registration", RegistrationSchema);
