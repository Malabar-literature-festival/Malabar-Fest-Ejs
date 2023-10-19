var express = require("express");
const { decrypt } = require("../../middleware/ccavutil");
var router = express.Router();
const crypto = require("crypto");
const Registration = require("../../models/Registration");
const { default: axios } = require("axios");
const TempReg = require("../../models/TempReg");

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
    console.log("User :- ", user);

    if (responseArray["order_status"] === "Success") {
      const tempRegData = await TempReg.findById(user);

      console.log("tempRegData::", tempRegData)
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

        // // Delete the tempRegData as it's no longer needed
        // await TempReg.findByIdAndRemove(user);
      }

      const registeredUser = await Registration.findById(registrationData._id);
      console.log("Payment Success User :- ", registeredUser);
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
module.exports = router;
