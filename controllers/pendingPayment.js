const { default: mongoose, isValidObjectId } = require("mongoose");
const Registration = require("../models/Registration");
const TempReg = require("../models/TempReg");
const { encrypt } = require("../middleware/ccavutil");
const dotenv = require("dotenv"); // Import dotenv
const crypto = require("crypto");
const qs = require("querystring");
const axios = require("axios");
dotenv.config();

exports.getPendingPayment = async (req, res) => {
  console.log(req.query);
  const { orderId, userId } = req.query;
  const access_code = process.env.ACCESSCODE;
  const working_key = process.env.WORKINGKEY;

  function encrypt(plainText, key = working_key) {
    const keyHash = crypto.createHash("md5").update(key).digest();
    const initVector = Buffer.from([
      0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
      0x0c, 0x0d, 0x0e, 0x0f,
    ]);
    const cipher = crypto.createCipheriv("aes-128-cbc", keyHash, initVector);
    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }

  function decrypt(encryptedText, key = working_key) {
    const keyHash = crypto.createHash("md5").update(key).digest();
    const initVector = Buffer.from([
      0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
      0x0c, 0x0d, 0x0e, 0x0f,
    ]);
    const encryptedTextBuffer = Buffer.from(encryptedText, "hex");
    const decipher = crypto.createDecipheriv(
      "aes-128-cbc",
      keyHash,
      initVector
    );
    let decrypted = decipher.update(encryptedTextBuffer, "binary", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  try {
    // const userDetails = await Registration.find();
    // const orderId = userDetails.orderId;

    console.log(orderId);
    const order_id = orderId; // Replace with your order ID
    const params = { order_no: order_id, reference_no: "" };
    const encReq = encrypt(JSON.stringify(params));
    const final_data = qs.stringify({
      enc_request: encReq,
      access_code: access_code,
      command: "orderStatusTracker",
      request_type: "JSON",
      response_type: "JSON",
    });

    const ccavenue_res = await axios.post(
      "https://api.ccavenue.com/apis/servlet/DoWebTrans",
      final_data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const info = qs.parse(ccavenue_res.data);
    console.log("Info: ", info);

    const payment_status = decrypt(info.enc_response);
    console.log("Payment Status: ", payment_status);
    const status = info.status;
    if (status === "0" || 0) {
      const user = await TempReg.findByIdAndUpdate(userId, {
        paymentStatus: "Failed",
      });
    } else {
      await TempReg.findByIdAndUpdate(userId, {
        paymentStatus: "Success",
      });
      const tempRegData = await TempReg.findById(userId);

      if (tempRegData) {
        var registrationData = new Registration({
          name: tempRegData.name,
          gender: tempRegData.gender,
          mobileNumber: tempRegData.mobileNumber,
          email: tempRegData.email,
          // profession: tempRegData.profession,
          // regDate: tempRegData.regDate,
          // matterOfInterest: tempRegData.matterOfInterest,
          regType: tempRegData.regType,
          image: tempRegData.image,
          amount: tempRegData.amount,
          orderId: tempRegData.orderId,
          paymentStatus: "success"
        });

        // Save the registration data to the Registration collection
        await registrationData.save();

        // // Delete the tempRegData as it's no longer needed
        // await TempReg.findByIdAndRemove(userId);
      }
    }
    console.log("Status: ", status);
    return payment_status;
  } catch (error) {
    console.error("Error:", error);
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