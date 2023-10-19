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
      enum: ["attende", "delegate", "student"],
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
    // paymentStatus: {
    //   type: String,
    //   default: 'Processing'
    // }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Registration", RegistrationSchema);
