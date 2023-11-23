var express = require("express");
var router = express.Router();
const Registration = require("../../models/Registration");
const TempReg = require("../../models/TempReg");
const upload = require("../../middleware/uploadEjs");
const bcrypt = require("bcrypt");
const axios = require("axios");
const nodemailer = require("nodemailer");
const qr = require("qrcode");
const fs = require("fs");

const { default: mongoose, isValidObjectId } = require("mongoose");
const { encrypt } = require("../../middleware/ccavutil");
const dotenv = require("dotenv"); // Import dotenv
const crypto = require("crypto");
const { getS3Middleware } = require("../../middleware/s3client");
const getUploadMiddleware = require("../../middleware/upload");

exports.paymentGeneration = async (
  req,
  res,
  delegateData,
  userId,
  qrCodeFileName
) => {
  try {
    const user = userId;
    if (isValidObjectId(userId)) {
      //const userDetails= //get user details
      const domain = `https://${req.get("host")}`;
      // Generate a unique order id

      //create a order table and add each payment activity order number in the table to check payment status and update payment status or to get user details
      const orderId = generateUniqueOrderId();
      //asssind amount in same format
      const amount = 399.0;

      // Generate Md5 hash for the key and then convert to base64 string
      var md5 = crypto
        .createHash("md5")
        .update(process.env.WORKINGKEY)
        .digest();
      var keyBase64 = Buffer.from(md5).toString("base64");
      //Initializing Vector and then convert in base64 string
      var ivBase64 = Buffer.from([
        0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
        0x0c, 0x0d, 0x0e, 0x0f,
      ]).toString("base64");

      const plainText = `merchant_id=${process.env.MERCHENTID}&order_id=${orderId}&currency=INR&amount=${amount}&redirect_url=${domain}/register/payment-status/${user}&cancel_url=${domain}/register/payment-status/${user}`;
      const encRequest = encrypt(plainText, keyBase64, ivBase64);

      // Prepare the response with a form for redirection
      // this will auto redirect to payment page
      res.status(200).send(`
     <form id="nonseamless" method="post" name="redirect" action="https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/>
       <input type="hidden" id="encRequest" name="encRequest" value="${encRequest}">
       <input type="hidden" name="access_code" id="access_code" value="${process.env.ACCESSCODE}">
       <script language="javascript">document.redirect.submit();</script>
     </form>
   `);

      // const existingUser = await TempReg.findOne({
      //   email: delegateData.email,
      // });
      // Check if a user with the same email or mobile number already exists
      const existingUser = await TempReg.findOne({ _id: userId });
      console.log(existingUser);
      console.log("delegateData :- ", delegateData);
      // existingUser.profession = delegateData.profession;
      // existingUser.regDate = delegateData.regDate;
      // existingUser.matterOfInterest = delegateData.matterOfInterest;
      existingUser.regType = delegateData.regType;
      existingUser.place = delegateData.place;
      existingUser.image = delegateData.image;
      existingUser.orderId = orderId;
      existingUser.amount = amount;

      await existingUser.save();

      console.log("After Save : ", existingUser);

      delete req.session.email;
    } else {
      // console.log(err);
      res.status(404).json({
        success: false,
        message: err,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

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
  res.render("delegate", { title, savedEmail, metaTags });
});

router.post("/", getUploadMiddleware("mlf/uploads/profile", ["photo", "transactionImage"]),getS3Middleware(["photo", "transactionImage"]), async function (req, res, next) {
  try {
    const imagePath = req.file ? req.file.path : null;
    console.log("Body Data :- ", req.body);
    console.log(imagePath);

    // Check if a user with the same email or mobile number already exists in the Registration collection
    const existingUserInRegistration = await Registration.findOne({
      $or: [{ email: req.body.email }, { mobileNumber: req.body.contact }],
    });

    if (existingUserInRegistration) {
      // Handle the case where the user is already registered in the Registration collection
      return res.status(400).json({ error: "User is already registered" });
    }

    // Create a new TempReg instance with the registration data
    const delegateData = new TempReg({
      name: req.body.name,
      gender: req.body.gender,
      mobileNumber: req.body.contact,
      email: req.body.email,
      profession: req.body.profession,
      // regDate: tempRegData.regDate,
      // matterOfInterest: tempRegData.matterOfInterest,
      regType: req.body.type,
      place: req.body.place,
      image: req.body.photo,
      transactionImage: req.body.transactionImage,
      transitionId: req.body.transitionId,
      amount: 399,
      orderId: "Gpay",
      paymentStatus: "pending",
    });

    const registrationData = new Registration({
      name: req.body.name,
      gender: req.body.gender,
      mobileNumber: req.body.contact,
      email: req.body.email,
      profession: req.body.profession,
      // regDate: tempRegData.regDate,
      // matterOfInterest: tempRegData.matterOfInterest,
      regType: req.body.type,
      place: req.body.place,
      image: req.body.photo,
      transactionImage: req.body.transactionImage,
      transactionId: req.body.transactionId,
      amount: 399,
      orderId: "Gpay",
      paymentStatus: "pending",
    });

    // Save the registration data to the TempReg collection
    await registrationData.save();
    await delegateData.save();

    const userId = delegateData._id; // Access the ID from the instance

    //--------------------------------- QR CODE START ---------------------------------

    // Create the QR Code Directory if it doesn't exist
    const qrCodeDirectory = "./uploads/qrcodes";
    if (!fs.existsSync(qrCodeDirectory)) {
      fs.mkdirSync(qrCodeDirectory);
    }

    // Generate QR CODE and save it as a PNG file
    const qrCodeFileName = `${qrCodeDirectory}/${userId}.png`;
    await qr.toFile(qrCodeFileName, JSON.stringify(userId));

    //--------------------------------- QR CODE END ---------------------------------

    // Call the paymentGeneration function with the necessary parameters
    // exports.paymentGeneration(req, res, delegateData, userId, qrCodeFileName);
    res.status(200).json({ message: "Registration success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Array to store used order IDs
const usedOrderIds = [];

// Function to check if an order ID is unique
function isOrderIdUnique(orderId) {
  // Check if the orderId is in the usedOrderIds array
  return !usedOrderIds.includes(orderId);
}

// Function to generate a unique order ID
function generateUniqueOrderId() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const orderIdLength = 8;
  let orderId = "";

  // Generate a random 8-character order ID
  for (let i = 0; i < orderIdLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    orderId += characters.charAt(randomIndex);
  }

  // Check if the generated order ID is unique
  if (isOrderIdUnique(orderId)) {
    // If unique, add it to the usedOrderIds array
    usedOrderIds.push(orderId);
    return orderId;
  } else {
    // If not unique, recursively generate a new one until it is unique
    return generateUniqueOrderId();
  }
}

module.exports = router;
