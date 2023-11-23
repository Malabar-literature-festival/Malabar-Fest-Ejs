const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
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
      type: [String],
    },
    regType: {
      type: String,
      enum: ["attende", "delegate", "student", "foreign"],
    },
    regDate: [
      {
        type: Date,
      },
    ],
    commonReg: {
      type: String,
      enum: ["commonReg"],
    },
    regRef: {
      type: String,
    },
    countryFrom: {
      type: String,
    },
    place: {
      type: String,
    },
    image: {
      type: String,
    },
    orderId: {
      type: String,
    },
    amount: {
      type: String,
    },
    attended: {
      type: Boolean,
      default: false,
    },
    qrImage: {
      type: String,
    },
    paymentStatus: {
      type: String,
    },
    otp: {
      code: {
        type: String,
      },
      timestamp: {
        type: Date,
      },
    },
    transactionId: {
      type: String,
    },
    transactionImage: {
      type: String,
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Registration", RegistrationSchema);
