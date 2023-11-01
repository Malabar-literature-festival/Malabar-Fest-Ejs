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

router.post("/submit", upload.single("photo"), async function (req, res, next) {
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
    //--------------------------------- QR CODE START ---------------------------------

    // Create the QR Code Directory if it doesn't exist
    const qrCodeDirectory = "./uploads/qrcodes";
    if (!fs.existsSync(qrCodeDirectory)) {
      fs.mkdirSync(qrCodeDirectory);
    }

    // Generate QR CODE and save it as PNG file
    const qrCodeFileName = `${qrCodeDirectory}/${newVolunteer._id}.png`;
    await qr.toFile(qrCodeFileName, JSON.stringify(newVolunteer._id));

    //--------------------------------- QR CODE END ---------------------------------

    await sendConfirmationEmail(newVolunteer, qrCodeFileName);
    await sendWhatsAppMessage(newVolunteer.mobile, newVolunteer);

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

    return res.status(200).json({ message: "Registration completed" });
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
    subject: `Registration Confirmation for volunteer at Malabar Literature Festival 2023`,
    html: `<!DOCTYPE html>
    <html>
    <head>
      <style>
        .container {
            color:white;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          background-color: #05102c;
          padding: 0px;
          border: 2px solid #333;
          width: 400px;
          margin: 0 auto;
        }
        .img{
            background:white;
            width:100%;
            padding:20px;
            margin-top:5px;
        }
        .header {
          font-size: 24px;
          font-weight: bold;
          text-decoration-line: underline;
          text-decoration-style: wavy;
          text-decoration-skip-ink: none;
          text-underline-offset: 15px;
          padding:20px;
        }
        .content {
          font-size: 16px;
          padding:20px;
        }
        .contact {
          margin-top: 0px;
          padding:20px;
        }
        .banner {
          width: 200px;
          max-height: 150px;
          object-fit: cover;
        }
        a{
            color:white;
        }
      </style>
    </head>
    <body>
      <div class="container">
      <div class="content">
      <div class="header">
        <p>Hello ${volunteerData.name},</p>
      </div>
          <p>We're happy to inform you that your volunteer application for the Malabar Literature Festival 2023 has been successful!
          Your eagerness to be part of our dedicated team is highly appreciated. We'll soon send you more details on the following procedures.</p>
          
          <p>If you ever feel like sharing your thoughts or have questions, don't hesitate to reach out to us via email.</p>
    
          <div class="contact">
          <p>Warm regards,</p>
            <p>Malabar Literature Festival Organizing Committee</p>
            <p><a href="mailto:info@malabarliteraturefestival.com">info@malabarliteraturefestival.com</a></p>
          </div>
        </div>
      </div>
    </body>
    </html>
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

  const WhatsappMessage = `Hello ${volunteerData.name},
We're happy to  inform you that your volunteer application for the Malabar Literature Festival 2023 has been successfull! 
Your eagerness to be part of our dedicated team is highly appreciated. 
We'll soon send you more details on the following procedures. 
If you ever feel like sharing your thoughts, questions don't hesitate to reach out to us on email. 
    
Warm regards,
    
Malabar Literature Festival Organizing Committee
info@malabarliteraturefestival.com`;

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
