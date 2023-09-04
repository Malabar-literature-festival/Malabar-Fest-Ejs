var express = require("express");
var router = express.Router();
const Registration = require("../models/Registration");
const bcrypt = require("bcrypt");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("attende", { title: "Express" });
});

router.post("/", async function (req, res) {
  try {
    console.log(req.body);

    // Check if a user with the same email already exists
    const existingUser = await Registration.findOne({ email: req.body.email });

    if (!existingUser) {
      // Handle the case where the user's basic data is not found
      return res.status(404).json({ error: "User not found" });
    }

    if (existingUser.regType === "attende" || existingUser.regType === "student" || existingUser.regType === "delegate") {
      // User has already registered
      console.log("User has already registered");
      return res.status(400).json({ error: "User has already registered" });
    }

    if (existingUser.commonReg === "commonReg") {
      // Update the existing "commonReg" registration data
      existingUser.district = req.body.location;
      existingUser.profession = req.body.profession;
      existingUser.regDate = req.body.day;
      existingUser.matterOfInterest = req.body.interest;
      existingUser.regType = req.body.type;
      await existingUser.save();

      // Redirect or respond as needed
      return res.status(200).json({ message: "Registration Successfull" })
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/check-email", async function (req, res, next) {
  try {
    const existingUser = await Registration.findOne({ email: req.body.email });
    if (existingUser) {
      return res.json({ error: "Email already exists" });
    }

    return res.json({});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
