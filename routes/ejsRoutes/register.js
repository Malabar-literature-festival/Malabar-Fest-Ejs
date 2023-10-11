var express = require("express");
const { decrypt } = require("../../middleware/ccavutil");
var router = express.Router();
const crypto = require("crypto");
const Registration = require("../../models/Registration");
const { default: axios } = require("axios");

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
router.post("/payment-status/:user", async function (req, res, next) {
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
  
  // Your encryption code here
  var md5 = crypto.createHash("md5").update(process.env.WORKINGKEY).digest();
  var keyBase64 = Buffer.from(md5).toString("base64");
  // Initializing Vector and then convert it to a base64 string
  var ivBase64 = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
    0x0c, 0x0d, 0x0e, 0x0f,
  ]).toString("base64");
  var encryption = req.body.encResp;
  ccavResponse = decrypt(encryption, keyBase64, ivBase64);

  // The final response
  const responseArray = ccavResponse.split("&").reduce((acc, pair) => {
    const [key, value] = pair.split("=");
    acc[key] = value;
    return acc;
  }, {});

  const { user } = req.params;
  console.log("User :- ", user);
  
  // get user details and update payment status
  if (responseArray["order_status"] === "Success") {
    const registeredUser = await Registration.findById({ _id: user });
    console.log("Payment Success User :- ", registeredUser);
    res.render("success", { title: "Payment Success", metaTags, registeredUser });
  } else {
    const registeredUser = await Registration.findById({ _id: user });
    console.log("Payment failed User :- ", registeredUser);
    res.render("failed", { title: "Payment Failed", metaTags, registeredUser });
  }

  // Prepare the data for the POST request
  const postData = {
    enc_request: encryption,
    access_code: process.env.ACCESSCODE,
    request_type: 'JSON',
    response_type: 'JSON',
    command: 'orderStatusTracker',
    version: '1.2'
  };

  // Make the POST request to the CCAvenue URL
  try {
    const response = await axios.post(`https://apitest.ccavenue.com/apis/servlet/DoWebTrans`, postData);
    
    // Handle the response here
    console.log("res...:", response)
    console.log('Response from CCAvenue:', response.data);

    // ... (the rest of your code to process the response)
  } catch (error) {
    console.error('Error making POST request:', error);
    // Handle errors here
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
module.exports = router;
