var express = require("express");
var router = express.Router();
const Registration = require('../models/Registration');

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("attende", { title: "Express" });
});

router.post("/reg", async function (req, res, next) {
  console.log('Attendee registration ...................')
  try {
    console.log(req.body)
    const newRegistration = new Registration({
      regType: req.body.type,
      name: req.body.name,
      gender: req.body.gender,
      mobileNumber: req.body.contact,
      email: req.body.email,
      password: req.body.password,
      district: req.body.location,
      profession: req.body.profession,
      regDate: req.body.day,
      matterOfInterest: req.body.interest,
    });

    // Save the registration data to the database
    await newRegistration.save();

    return res.status(201).json({ message: "registered successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
