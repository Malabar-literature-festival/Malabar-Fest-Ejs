const express = require("express");
const router = express.Router();

const Registration = require("../../models/Registration");
const axios = require("axios");
const nodemailer = require("nodemailer");
const qr = require("qrcode");
const fs = require("fs");

/* GET home page. */
router.post("/", async function (req, res, next) {
  try {
    console.log("dkjf");
    console.log(req.body);
    console.log(req.params);
    const mobile = req.body.mobile || req.params.mobile;
    const mobileNumber = await Registration.findOne({ mobile });
    if (!mobileNumber) {
      return res.status(200).json({ message: "Mobile number not found" });
    }
    // else {
    //   let otp = Math.floor(Math.random() * 9999);
    //   console.log(`OTP is ${otp}`);
    // }
    // res.render("login");
  } catch (err) {
    console.log(err);
  }
});

function sendWhatsAppMessage(existingUser) {
  console.log("Existing User", existingUser);
  let mobileNumber = existingUser.mobileNumber;
  if (!mobileNumber.startsWith("91")) {
    mobileNumber = "91" + mobileNumber;
  }
  const WhatsappMessage = `Dear ${existingUser.name}`;

  const whatsappApiUrl = process.env.WHATSAPP_API_URL;
  const whatsappData = {
    number: mobileNumber,
    type: "text",
    message: WhatsappMessage,
    instance_id: process.env.WHTSP_INSTANCE_ID,
    access_token: process.env.WHTSP_ACCESS_TOKEN,
  };

  axios
    .post(whatsappApiUrl, whatsappData)
    .then(function (response) {
      console.log("WhatsApp message sent successfully:", response.data);
    })
    .catch(function (error) {
      console.error("Error sending WhatsApp message:", error);
    });
}

module.exports = router;
