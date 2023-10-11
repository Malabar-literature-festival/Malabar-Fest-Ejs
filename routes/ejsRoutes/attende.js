var express = require("express");
var router = express.Router();
const Registration = require("../../models/Registration");
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
  res.render("attende", { title, savedEmail, metaTags });
});

router.post("/", async function (req, res) {
  try {
    console.log(req.body);

    // Check if a user with the same email already exists
    const existingUser = await Registration.findOne({ email: req.body.email });

    // if (!existingUser) {
    //   return res.status(404).json({ error: "User not registered" });
    // }

    if (existingUser) {
      if (
        existingUser.regType === "attende" ||
        existingUser.regType === "student" ||
        existingUser.regType === "delegate"
      ) {
        // User has already registered
        console.log("User has already registered");
        return res.status(400).json({ error: "User has already registered" });
      }
    }


    const savedEmail = req.session.email;

      // Update the existing "commonReg" registration data
      existingUser.name = req.body.name,
      existingUser.gender = req.body.gender,
      existingUser.mobileNumber = req.body.contact,
      existingUser.email = req.body.email,
      existingUser.district = req.body.location;
      existingUser.profession = req.body.profession;
      existingUser.regDate = req.body.day;
      existingUser.matterOfInterest = req.body.intrest; // Fix the typo in the field name
      existingUser.regType = req.body.type;
      await existingUser.save();

      const delegateData = new Registration({
        name: req.body.name,
        gender: req.body.gender,
        mobileNumber: req.body.contact,
        email: req.body.email,
        district: req.body.location,
        profession: req.body.profession,
        regDate: req.body.day,
        matterOfInterest: req.body.intrest, // Fix the typo in the field name
        regType: req.body.type,
      });
  
      // Save the registration data to the database
      await delegateData.save();
      delete req.session.email;

      let mobileNumber = existingUser.mobileNumber;

      if (!mobileNumber.startsWith("91")) {
        mobileNumber = "91" + mobileNumber;
      }
      const WhatsappMessage = `
      Dear ${existingUser.name},

      We are thrilled to inform you that your registration for the Malabar Literature Festival 2023 has been successfully confirmed! We can't wait to welcome you to this exciting literary event, which will take place at the beautiful Calicut Beach from November 30th to December 3rd.
      
      We look forward to seeing you at the Malabar Literature Festival 2023 and sharing in the celebration of literature and culture.
      
      Thank you for your participation, and best wishes for an inspiring and memorable festival!
      
      Warm regards,
      
      Malabar Literature Festival Organizing Committee
      Help Desk: +91 9539327252
      `;

      // Send a WhatsApp message using the WhatsApp API
      const whatsappApiUrl = "https://text.dxing.in/api/send";
      const whatsappData = {
        number: mobileNumber,
        type: "text",
        message: WhatsappMessage,
        instance_id: "64FD58E3440E2",
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
    
    const html = `
    Dear ${existingUser.name},
        
    We are thrilled to inform you that your registration for the Malabar Literature Festival 2023 has been successfully confirmed! We can't wait to welcome you to this exciting literary event, which will take place at the beautiful Calicut Beach from November 30th to December 3rd.
    
    Your participation in the Malabar Literature Festival will grant you access to a diverse range of literary discussions, author sessions, workshops, and cultural performances. We have a spectacular lineup of renowned authors, poets, and speakers who will engage in thought-provoking conversations, and we are confident that you will have an enriching and enjoyable experience.
    
    Please keep an eye on your email for further updates, including the festival schedule, information about speakers and sessions, and any last-minute changes. We recommend that you arrive at the venue well in advance to ensure you get the best experience possible.
    
    If you have any questions or require additional information, please do not hesitate to contact our support team at info@malabarliteraturefestival.com or call us at +91 9539327252.
    
    We look forward to seeing you at the Malabar Literature Festival 2023 and sharing in the celebration of literature and culture.
    
    Thank you for your participation, and best wishes for an inspiring and memorable festival!
    
    Warm regards,
    
    Malabar Literature Festival Organizing Committee
    Help Desk: +91 9539327252
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: existingUser.email,
      subject: `Registration Confirmation for ${existingUser.regType} at Malabar Literature Festival 2023`,
      text: html,
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
    delete req.session.email;
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
