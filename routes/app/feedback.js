// const express = require("express");
// const router = express.Router();

// const Registration = require("../../models/Registration");
// const axios = require("axios");
// const nodemailer = require("nodemailer");
// const qr = require("qrcode");
// const fs = require("fs");
// const Feedback = require("../../models/Feedback");

// /* GET home page. */
// router.post("/", async function (req, res, next) {
//   try {
//     // console.log("dkjf");
//     // console.log(req.body);
//     // console.log(req.params);

//     const { session, description, user } = req.body;
//     const newFeedback = new Feedback({
//       session,
//       description,
//       user,
//     });
//     // Save the feedback to the database
//     await newFeedback.save();

//     res.json({ success: true, message: 'Feedback saved successfully' }).send(newFeedback);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Error saving feedback' });
//   }
//   // } catch (err) {
//   //   console.log(err);
//   // }
// });

// function sendWhatsAppMessage(existingUser) {
//   console.log("Existing User", existingUser);
//   let mobileNumber = existingUser.mobileNumber;
//   if (!mobileNumber.startsWith("91")) {
//     mobileNumber = "91" + mobileNumber;
//   }
//   const WhatsappMessage = `Dear ${existingUser.name}`;

//   const whatsappApiUrl = process.env.WHATSAPP_API_URL;
//   const whatsappData = {
//     number: mobileNumber,
//     type: "text",
//     message: WhatsappMessage,
//     instance_id: process.env.WHTSP_INSTANCE_ID,
//     access_token: process.env.WHTSP_ACCESS_TOKEN,
//   };

//   axios
//     .post(whatsappApiUrl, whatsappData)
//     .then(function (response) {
//       console.log("WhatsApp message sent successfully:", response.data);
//     })
//     .catch(function (error) {
//       console.error("Error sending WhatsApp message:", error);
//     });
// }



// module.exports = router;

const router = require("express").Router();
// Controllers
const {
  createFeedback,
  getFeedback,
  updateFeedback,
  deleteFeedback,
  select,
  // getByFranchise,
} = require("../../controllers/feedback");
// Middleware
const { protect, authorize } = require("../../middleware/auth");
const { reqFilter } = require("../../middleware/filter");

router
  .route("/")
  .post(createFeedback)
  .get(reqFilter, getFeedback)
  .put(updateFeedback)
  .delete(deleteFeedback);

router.get("/select", reqFilter, select);

module.exports = router;
