var express = require("express");
const { decrypt } = require("../../middleware/ccavutil");
var router = express.Router();
const crypto = require("crypto");
const Registration = require("../../models/Registration");
const { default: axios } = require("axios");
const TempReg = require("../../models/TempReg");
const fs = require("fs");
const qr = require("qrcode");
const nodemailer = require("nodemailer");

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
  res.render("register", { title, metaTags });
});
// Payment status route
router.post("/payment-status/:user", async function (req, res, next) {
  try {
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

    var md5 = crypto.createHash("md5").update(process.env.WORKINGKEY).digest();
    var keyBase64 = Buffer.from(md5).toString("base64");
    var ivBase64 = Buffer.from([
      0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
      0x0c, 0x0d, 0x0e, 0x0f,
    ]).toString("base64");
    var encryption = req.body.encResp;
    ccavResponse = decrypt(encryption, keyBase64, ivBase64);

    const responseArray = ccavResponse.split("&").reduce((acc, pair) => {
      const [key, value] = pair.split("=");
      acc[key] = value;
      return acc;
    }, {});

    const { user } = req.params;
    console.log("User :- ", req.params);

    if (responseArray["order_status"] === "Success") {
      const tempRegData = await TempReg.findById(user);

      console.log("tempRegData::", tempRegData);
      if (tempRegData) {
        var registrationData = new Registration({
          name: tempRegData.name,
          gender: tempRegData.gender,
          mobileNumber: tempRegData.mobileNumber,
          email: tempRegData.email,
          profession: tempRegData.profession,
          regDate: tempRegData.regDate,
          matterOfInterest: tempRegData.matterOfInterest,
          regType: tempRegData.regType,
          image: tempRegData.image,
          amount: tempRegData.amount,
          orderId: tempRegData.orderId,
        });

        // Save the registration data to the Registration collection
        await registrationData.save();
      }

      const qrCodeFileName = `./uploads/qrcodes/${user}.png`; // Change to the actual file path
      const qrCodeImage = fs.readFileSync(qrCodeFileName);

      console.log("qrCodeImage", qrCodeImage);
      console.log("qrCodeFileName", qrCodeFileName);

      const registeredUser = await Registration.findById(registrationData._id);
      console.log("Payment Success User :- ", registeredUser);
      sendWhatsAppMessage(registeredUser);
      sendConfirmationEmail(registeredUser, qrCodeFileName);
      res.render("success", {
        title: "Payment Success",
        metaTags,
        registeredUser,
      });
    } else {
      const registeredUser = await TempReg.findById(user);
      console.log("Payment failed User :- ", registeredUser);
      res.render("failed", {
        title: "Payment Failed",
        metaTags,
        registeredUser,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    // Handle other errors here
  }
});

router.post("/payment-cancelled/:user", function (req, res, next) {
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
  console.log("body", req.body);
  console.log("params", req.params);
  const title =
    "Malabar Literature Festival | Celebrating History, Language, and Culture";
  res.render("status", { title, metaTags });
});

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
  Help Desk: +91 9539327252`;

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
