var express = require("express");
const Registration = require("../../models/Registration");
var router = express.Router();
// const bcrypt = require('bcrypt')
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
  connectionTimeout: 30000, // 30 seconds
  timeout: 60000, // 60 seconds
});

/* GET home page. */
router.get("/", function (req, res, next) {
  const metaTags = [
    {
      description:
        "Join the Malabar Literature Festival MLF, a cultural gathering celebrating the rich histories, legacies, languages, and arts of Malabar and its historic connections with distant lands like Kayalpattinam, Gujarat, Lakshadweep, Andaman and Nicobar, Hadhramaut, Malaysia, and Africa. Explore literature through open forums, talks, and debates. Delve into the lifeworlds of Mappila and Dalit subalterns. Discover a unique literary experience with Book Plus.",
    },
    {
      keywords:
        "Malabar Literature Festival, MLF, Malabar, Kozhikode Beach, Calicut Beach, Malabar culture, literature, history, languages, arts, Kayalpattinam, Gujarat, Lakshadweep, Andaman and Nicobar, Hadhramaut, Malaysia, Africa, Mappila, Dalit, Book Plus, Malayalam readers",
    },
    {
      author: "Malabar Literature Festival ",
    },
    {
      robots: "index, follow",
    },
  ];

  const title =
    "Malabar Literature Festival | Celebrating History, Language, and Culture";
  const savedEmail = req.session.email;

  if (savedEmail) {
    // You can use the savedEmail variable here
    console.log("Email retrieved from session:", savedEmail);
  } else {
    // Handle the case where the email is not found in the session
  }
  res.render("commonReg", { title, metaTags });
});

router.post("/", async function (req, res, next) {
  try {
    console.log(req.body);

    const email = req.body.email;

    // Store the email in the session
    req.session.email = email;

    // Check if a user with the same email already exists
    const existingUser = await Registration.findOne({ email: req.body.email });
    console.log("Existing user In common Reg :", existingUser);
    if (existingUser) {
      return res.json({ message: "You are already registered" }); //redirect("/register");
    }

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
      message: `Dear ${req.body.name},
          
      Your registration for the Malabar Literature Festival 2023 has been successfully confirmed.

      We welcome you to this exciting literary event, which will take place at Calicut Beach from November 30th to December 3rd.     
      
      Thank you for your participation, and best wishes for an inspiring and memorable festival!
      
      Warm regards,
      
      Malabar Literature Festival Organizing Committee
      Help Desk: +91 9539327252`,
      instance_id: "64FD58E3440E2",
      access_token: "64afe205189a4",
    };

    // Send the WhatsApp message using Axios or another HTTP library
    axios
      .post(whatsappApiUrl, whatsappData)
      .then(function (response) {
        console.log("WhatsApp message sent successfully:", response.data);
        return res.status(200).json({
          message: `Dear ${req.body.name},
        Your registration for the Malabar Literature Festival 2023 has been successfully confirmed.`,
        });
      })
      .catch(function (error) {
        console.error("Error sending WhatsApp message:", error);
        return res
          .status(500)
          .json({ error: "Error sending WhatsApp message" });
        // return res.status(500).json({ error: "Error sending WhatsApp message" });
      });

    // const html = `
    //   Dear ${req.body.name},
          
    //   Your registration for the Malabar Literature Festival 2023 has been successfully confirmed.

    //   We welcome you to this exciting literary event, which will take place at Calicut Beach from November 30th to December 3rd.     
      
    //   Thank you for your participation, and best wishes for an inspiring and memorable festival!
      
    //   Warm regards,
      
    //   Malabar Literature Festival Organizing Committee
    //   Help Desk: +91 9539327252
    //   `;

    // const mailOptions = {
    //   from: process.env.SMTP_FROM_EMAIL,
    //   to: req.body.email,
    //   subject: `Registration Confirmation for Malabar Literature Festival 2023`,
    //   text: html,
    // };

    // transporter.sendMail(mailOptions, function (error, info) {
    //   if (error) {
    //     console.error("Error sending email:", error);
    //     return res.status(500);
    //   } else {
    //     console.log("Email sent successfully:", info.response);
    //     return res.status(200);
    //   }
    // });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
