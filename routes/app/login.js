const express = require("express");
const router = express.Router();

const Registration = require("../../models/Registration");
const axios = require("axios");
const nodemailer = require("nodemailer");

router.post("/", async function (req, res, next) {
  try {
    const mobile = req.body.mobile;
    const user = await Registration.findOne({ mobileNumber: mobile });

    if (!user) {
      return res.status(200).json({ message: "Mobile number not found" });
    } else {
      let otp = Math.floor(1000 + Math.random() * 9000);
      sendWhatsAppMessage(user, otp);
      sendConfirmationEmail(user, otp)
      // Save the generated OTP in the database for verification
      user.otp = {
        code: otp,
        timestamp: new Date(),
      };
      await user.save();
      return res.status(200).json({ message: "OTP sent", otp });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/verify-otp", async function (req, res, next) {
  try {
    const mobile = req.body.mobile;
    const otp = req.body.otp;

    const user = await Registration.findOne({ mobileNumber: mobile });

    if (!user) {
      return res.status(500).json({ message: "Mobile number not found" });
    } else {
      if (user.otp && user.otp.code.toString() === otp.toString()) {
        const timestamp = user.otp.timestamp;
        const currentTime = new Date();

        // Check if OTP is within the 10-minute timeframe
        const timeDifference = (currentTime - timestamp) / (1000 * 60); // in minutes

        if (timeDifference <= 10) {
          // Clear the OTP after successful verification
          user.otp = null;
          await user.save();
          let status = "verified"
          sendWhatsAppVerify(user, status)
          return res.status(200).json({ message: "OTP verified successfully", user });
        } else {
          let status = "expired"
          sendWhatsAppVerify(user, status)
          return res.status(200).json({ message: "OTP expired" });
        }
      } else {
        return res.status(200).json({ message: "Invalid OTP" });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

function sendWhatsAppMessage(user, otp) {
  console.log("User", user);
  let mobileNumber = user.mobileNumber;
  if (!mobileNumber.startsWith("91")) {
    mobileNumber = "91" + mobileNumber;
  }
  const WhatsappMessage = `Your otp for login : ${otp}`;

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

function sendWhatsAppVerify(user, status) {
  console.log("User", user);
  let mobileNumber = user.mobileNumber;
  if (!mobileNumber.startsWith("91")) {
    mobileNumber = "91" + mobileNumber;
  }
  let WhatsappMessage;

  if (status == "verified"){
    WhatsappMessage = `Your otp is verified`;
  }
  else {
    WhatsappMessage = `Your otp is expired`;
  }

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

function sendConfirmationEmail(delegateData, otp) {
  console.log("Existing User", delegateData);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_FROM_EMAIL,
    to: delegateData.email,
    subject: `Login OTP for ${delegateData.name}`,
    html: `
      <p>Hi ${delegateData.name},
      <p>Your OTP for login is: <strong>${otp}</strong>
      <p>This OTP is valid for a 10 minutes.</p>
    `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent successfully:", info.response);
    }
  });
}


module.exports = router;
