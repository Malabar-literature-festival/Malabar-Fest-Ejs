const { default: mongoose, isValidObjectId } = require("mongoose");
const Registration = require("../models/Registration");
const TempReg = require("../models/TempReg");
const { encrypt } = require("../middleware/ccavutil");
const dotenv = require("dotenv"); // Import dotenv
const crypto = require("crypto");
const qs = require("querystring");
const fs = require("fs");
const axios = require("axios");
const { ObjectId } = require("mongodb");
dotenv.config();
const nodemailer = require("nodemailer");
const qr = require("qrcode");

exports.getApproved = async (req, res) => {
  try {
    const Id = req.query.userId;
    const userId = new ObjectId(req.query.userId);

    const user = await Registration.findByIdAndUpdate(
      userId,
      { $set: { approved: true, paymentStatus: "success" } },
      { new: true } // To return the updated document
    );

        // Create the QR Code Directory if it doesn't exist
        const qrCodeDirectory = "./uploads/qrcodes";
        if (!fs.existsSync(qrCodeDirectory)) {
          fs.mkdirSync(qrCodeDirectory);
        }
    
        // Generate QR CODE and save it as a PNG file
        const qrCodeFileName = `${qrCodeDirectory}/${Id}.png`;
        await qr.toFile(qrCodeFileName, JSON.stringify(Id));


    // const qrCodeFileName = `./uploads/qrcodes/${user}.png`; // Change to the actual file path
    const qrCodeImage = fs.readFileSync(qrCodeFileName);

    console.log("qrCodeImage", qrCodeImage);
    console.log("qrCodeFileName", qrCodeFileName);

    sendWhatsAppMessage(user);
    sendConfirmationEmail(user, qrCodeFileName);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Updated user:", user);
    res
      .status(200)
      .json({
        message: "User approved and payment status updated successfully",
      });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

function sendConfirmationEmail(existingUser, qrCodeFileName) {
  console.log("Existing User", existingUser);
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
    to: existingUser.email,
    subject: `Registration Confirmation for ${existingUser.regType} at Malabar Literature Festival 2023`,
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
          <p>Dear ${existingUser.name},</p>
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

function sendWhatsAppMessage(existingUser) {
  console.log("Existing User", existingUser);
  let mobileNumber = existingUser.mobileNumber;
  if (!mobileNumber.startsWith("91")) {
    mobileNumber = "91" + mobileNumber;
  }
  const WhatsappMessage = `Dear ${existingUser.name},
  We are thrilled to inform you that your registration for the Malabar Literature Festival 2023 has been successfully confirmed! We can't wait to welcome you to this exciting literary event, which will take place at the beautiful Calicut Beach from November 30th to December 3rd.
    
  We look forward to seeing you at the Malabar Literature Festival 2023 and sharing in the celebration of literature and culture.
    
  Thank you for your participation, and best wishes for an inspiring and memorable festival!
          
  Warm regards,
          
  Malabar Literature Festival Organizing Committee
  Help Desk: +91 9539327252`;

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
