var express = require("express");
var router = express.Router();
const Registration = require("../../models/Registration");
const bcrypt = require("bcrypt");
const axios = require("axios");
const nodemailer = require("nodemailer");
const qr = require("qrcode");
const fs = require("fs");

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
        return res.status(400).json({ message: "User has already registered" });
      }
    }

    // // change date string to date
    // const dateStrings = req.body.day;
    // const dateArray = dateStrings
    //   .split(",")
    //   .map((dateString) => dateString.trim());
    // const dateObjects = dateArray.map((dateString) => new Date(dateString));

    const delegateData = new Registration({
      name: req.body.name,
      gender: req.body.gender,
      mobileNumber: req.body.contact,
      email: req.body.email,
      // district: req.body.location,
      // profession: req.body.profession,
      countryFrom: req.body.countryFrom,
      place: req.body.place,
      // regDate: dateObjects,
      // matterOfInterest: req.body.intrest, // Fix the typo in the field name
      regType: req.body.type,
    });

    // Save the registration data to the database
    await delegateData.save();

    const userId = await Registration.findOne({
      email: req.body.email || delegateData.email,
    });

    const Id = userId._id;
    console.log("User ID: ", Id);

    //--------------------------------- QR CODE START ---------------------------------

    // Create the QR Code Directory if it doesn't exist
    const qrCodeDirectory = "./uploads/qrcodes";
    if (!fs.existsSync(qrCodeDirectory)) {
      fs.mkdirSync(qrCodeDirectory);
    }

    // Generate QR CODE and save it as PNG file
    const qrCodeFileName = `${qrCodeDirectory}/${Id}.png`;
    await qr.toFile(qrCodeFileName, JSON.stringify(Id));

    //--------------------------------- QR CODE END ---------------------------------

    let mobileNumber = delegateData.mobileNumber;

    sendConfirmationEmail(delegateData, qrCodeFileName);

    if (!mobileNumber.startsWith("91")) {
      mobileNumber = "91" + mobileNumber;
    }
    const WhatsappMessage = `Dear ${delegateData.name},
    We are thrilled to inform you that your registration for the Malabar Literature Festival 2023 has been successfully confirmed! We can't wait to welcome you to this exciting literary event, which will take place at the beautiful Calicut Beach from November 30th to December 3rd.
    We look forward to seeing you at the Malabar Literature Festival 2023 and sharing in the celebration of literature and culture.
    Thank you for your participation, and best wishes for an inspiring and memorable festival!
        
    Warm regards,
        
    Malabar Literature Festival Organizing Committee
    Help Desk: +91 9539327252`;

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
  } catch (error) {
    delete req.session.email;
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

function sendConfirmationEmail(delegateData, qrCodeFileName) {
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
    subject: `Registration Confirmation for ${delegateData.regType} at Malabar Literature Festival 2023`,
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
        <p>Dear ${delegateData.name},</p>
      </div>
          <p>We are thrilled to inform you that your registration for the Malabar Literature Festival 2023 has been successfully confirmed! We can't wait to welcome you to this exciting literary event, which will take place at the beautiful Calicut Beach from November 30th to December 3rd.</p>
    
          <p>Your participation in the Malabar Literature Festival will grant you access to a diverse range of literary discussions, author sessions, workshops, and cultural performances. We have a spectacular lineup of renowned authors, poets, and speakers who will engage in thought-provoking conversations, and we are confident that you will have an enriching and enjoyable experience.</p>
    
          <p>Please keep an eye on your email for further updates, including the festival schedule, information about speakers and sessions, and any last-minute changes. We recommend that you arrive at the venue well in advance to ensure you get the best experience possible.</p>
    
          <p>If you have any questions or require additional information, please do not hesitate to contact our support team at <a href="mailto:info@malabarliteraturefestival.com">info@malabarliteraturefestival.com</a> or call us at <a href="tel:+919539327252">+91 9539327252</a>.</p>
    
          <p>We look forward to seeing you at the Malabar Literature Festival 2023 and sharing in the celebration of literature and culture.</p>
    
          <p>Thank you for your participation, and best wishes for an inspiring and memorable festival!</p>
          <div class="contact">
            <p>Warm regards,<br>
            Malabar Literature Festival Organizing Committee<br>
            Help Desk: +91 9539327252</p>
          </div>
        </div>
      </div>
    </body>
    </html>`,
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

module.exports = router;
