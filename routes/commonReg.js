var express = require("express");
const Registration = require("../models/Registration");
var router = express.Router();
// const bcrypt = require('bcrypt')
const axios = require("axios");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("commonReg");
});

router.post("/", async function (req, res, next) {
  try {
    console.log(req.body);

    // Check if a user with the same email already exists
    const existingUser = await Registration.findOne({ email: req.body.email });
    console.log("Existing user In common Reg :", existingUser);
    if (existingUser) {
      return res.redirect("/register");
    }

    //   const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newRegistration = new Registration({
      commonReg: req.body.type,
      name: req.body.name,
      gender: req.body.gender,
      mobileNumber: req.body.contact,
      email: req.body.email,
      // password: hashedPassword,
    });

    // Save the registration data to the database
    await newRegistration.save();

    let mobileNumber = req.body.contact;

    if (!mobileNumber.startsWith("91")) {
      mobileNumber = "91" + mobileNumber;
    }
    // Send a WhatsApp message using the WhatsApp API
    const whatsappApiUrl = "https://text.dxing.in/api/send";
    const whatsappData = {
      number: mobileNumber,
      type: "text",
      message: `Hello ${req.body.name}. Thank you for registering...`,
      instance_id: "64F332EFCDADD",
      access_token: "64afe205189a4",
    };

    // Send the WhatsApp message using Axios or another HTTP library
    axios
      .post(whatsappApiUrl, whatsappData)
      .then(function (response) {
        console.log("WhatsApp message sent successfully:", response.data);
        return res.status(200).redirect("/register");
      })
      .catch(function (error) {
        console.error("Error sending WhatsApp message:", error);
        return res.status(500).redirect("/common-reg");
        // return res.status(500).json({ error: "Error sending WhatsApp message" });
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
