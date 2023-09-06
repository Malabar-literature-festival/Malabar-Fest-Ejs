var express = require("express");
var router = express.Router();
const Registration = require("../models/Registration");
const bcrypt = require("bcrypt");
const axios = require("axios");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("attende", { title: "Express" });
});

router.post("/", async function (req, res) {
  try {
    console.log(req.body);

    // Check if a user with the same email already exists
    const existingUser = await Registration.findOne({ email: req.body.email });

    if (!existingUser) {
      return res.status(404).json({ error: "User not registered" });
    }

    if (
      existingUser.regType === "attende" ||
      existingUser.regType === "student" ||
      existingUser.regType === "delegate"
    ) {
      console.log("User has already registered");
      return res.status(400).json({ error: "User has already registered" });
    }

    if (existingUser.commonReg === "commonReg") {
      // Update the existing "commonReg" registration data
      existingUser.district = req.body.location;
      existingUser.profession = req.body.profession;
      existingUser.regDate = req.body.day;
      existingUser.matterOfInterest = req.body.intrest; // Fix the typo in the field name
      existingUser.regType = req.body.type;
      await existingUser.save();

      let mobileNumber = existingUser.mobileNumber;

      if (!mobileNumber.startsWith("91")) {
        mobileNumber = "91" + mobileNumber;
      }
      // Send a WhatsApp message using the WhatsApp API
      const whatsappApiUrl = "https://text.dxing.in/api/send";
      const whatsappData = {
        number: mobileNumber,
        type: "text",
        message: `Hello ${existingUser.name}. Thank you for registering...`,
        instance_id: "64F332EFCDADD",
        access_token: "64afe205189a4",
      };

      // Send the WhatsApp message using Axios or another HTTP library
      axios
        .post(whatsappApiUrl, whatsappData)
        .then(function (response) {
          console.log("WhatsApp message sent successfully:", response.data);
          return res.status(200).json({ message: "Registration Successful" });
        })
        .catch(function (error) {
          console.error("Error sending WhatsApp message:", error);
          return res
            .status(500)
            .json({ error: "Error sending WhatsApp message" });
        });
    }
    const mailOptions = {
      from: 'info@malabarliteraturefestival.com', // Sender's Gmail email address
      to: existingUser.email, // Recipient's email address
      subject: "Registration Successful",
      text: `Hello ${existingUser.name},\n\nThank you for registering...`, // Email message
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500);
      } else {
        console.log("Email sent successfully:", info.response);
        return res.status(200);
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/check-email", async function (req, res, next) {
  try {
    const existingUser = await Registration.findOne({ email: req.body.email });
    if (existingUser) {
      return res.json({ error: "Email already exists" });
    }

    return res.json({});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
