var express = require("express");
var router = express.Router();
const upload = require("../../middleware/uploadEjs");
const Volunteer = require("../../models/Volunteer");
const bcrypt = require("bcrypt");
const axios = require("axios");
const nodemailer = require("nodemailer");
const qr = require("qrcode");
const fs = require("fs");

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

  // Initialize successMessage to an empty string
  const successMessage = "";

  const title =
    "Malabar Literature Festival | Celebrating History, Language, and Culture";
  res.render("volunter", { title, metaTags, successMessage });
});

router.post("/", upload.single("photo"), async function (req, res, next) {
  try {
    const imagePath = req.file ? req.file.path : null;
    console.log(req.body);
    console.log(imagePath);

    // Check if a user with the same email already exists
    const existingUser = await Volunteer.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const newVolunteer = new Volunteer({
      name: req.body.name,
      gender: req.body.gender,
      mobile: req.body.contact,
      email: req.body.email,
      institute: req.body.institute,
      category: req.body.category,
      place: req.body.place,
      age: req.body.age,
      workType: req.body.workType,
      timeSlot: req.body.timeSlot,
      reference: {
        name: req.body.reference_name,
        contact: req.body.mobile,
      },
      day: req.body.day,
      matterOfInterest: req.body.interest,
      image: imagePath,
    });

    // Save the volunteer registration data to the database
    await newVolunteer.save();

    // Pass a success message to the view
    const successMessage = "Registration successful!";

    const title =
      "Malabar Literature Festival | Celebrating History, Language, and Culture";

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

    res.render("volunter", { title, metaTags, successMessage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/check-email", async function (req, res, next) {
  try {
    const existingUser = await Volunteer.findOne({ email: req.body.email });
    if (existingUser) {
      return res.json({ error: "Email already exists" });
    }

    return res.json({});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

function sendConfirmationEmail(volunteerData, qrCodeFileName) {
  console.log("Existing User", volunteerData);
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
    to: volunteerData.email,
    subject: `Registration Confirmation for ${volunteerData.regType} at Malabar Literature Festival 2023`,
    text: `
    Dear ${volunteerData.name},
        
    We are thrilled to inform you that your registration for the Malabar Literature Festival 2023 has been successfully confirmed! We can't wait to welcome you to this exciting literary event, which will take place at the beautiful Calicut Beach from November 30th to December 3rd.
    
    Your participation in the Malabar Literature Festival will grant you access to a diverse range of literary discussions, author sessions, workshops, and cultural performances. We have a spectacular lineup of renowned authors, poets, and speakers who will engage in thought-provoking conversations, and we are confident that you will have an enriching and enjoyable experience.
    
    Please keep an eye on your email for further updates, including the festival schedule, information about speakers and sessions, and any last-minute changes. We recommend that you arrive at the venue well in advance to ensure you get the best experience possible.
    
    If you have any questions or require additional information, please do not hesitate to contact our support team at info@malabarliteraturefestival.com or call us at +91 9539327252.
    
    We look forward to seeing you at the Malabar Literature Festival 2023 and sharing in the celebration of literature and culture.
    
    Thank you for your participation, and best wishes for an inspiring and memorable festival!
    
    Warm regards,
    
    Malabar Literature Festival Organizing Committee
    Help Desk: +91 9539327252
  `,
    attachments: [
      {
        filename: "qr-code.png",
        path: qrCodeFileName,
        cid: "qrcodeImage",
      },
    ],
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent successfully:", info.response);
    }
  });
}

function sendWhatsAppMessage(mobileNumber, volunteerData) {
  if (!mobileNumber.startsWith("91")) {
    mobileNumber = "91" + mobileNumber;
  }

  const WhatsappMessage = `
    Dear ${volunteerData.name},

    We are thrilled to inform you that your registration for the Malabar Literature Festival 2023 has been successfully confirmed! We can't wait to welcome you to this exciting literary event, which will take place at the beautiful Calicut Beach from November 30th to December 3rd.
    
    We look forward to seeing you at the Malabar Literature Festival 2023 and sharing in the celebration of literature and culture.
    
    Thank you for your participation, and best wishes for an inspiring and memorable festival!
    
    Warm regards,
    
    Malabar Literature Festival Organizing Committee
    Help Desk: +91 9539327252
  `;

  const whatsappApiUrl = "https://text.dxing.in/api/send";
  const whatsappData = {
    number: mobileNumber,
    type: "text",
    message: WhatsappMessage,
    instance_id: "64FD58E3440E2",
    access_token: "64afe205189a4",
  };

  return axios
    .post(whatsappApiUrl, whatsappData)
    .then(function (response) {
      console.log("WhatsApp message sent successfully:", response.data);
      return { success: true, message: "WhatsApp message sent successfully" };
    })
    .catch(function (error) {
      console.error("Error sending WhatsApp message:", error);
      return { success: false, message: "Error sending WhatsApp message" };
    });
}

module.exports = sendWhatsAppMessage;

module.exports = router;
