var express = require("express");
var router = express.Router();
const upload = require('../middleware/upload');
const Volunteer = require("../models/Volunteer");
const bcrypt = require('bcrypt');

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("volunter");
});

router.post("/", upload.single('photo'), async function (req, res, next) {
  try {
    const imagePath = req.file ? req.file.path : null;
    console.log(req.body)
    console.log(imagePath)

    // Check if a user with the same email already exists
    const existingUser = await Volunteer.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newVolunteer = new Volunteer({
      name: req.body.name,
      gender: req.body.gender,
      mobile: req.body.contact,
      email: req.body.email,
      password: hashedPassword,
      institute: req.body.institute,
      category: req.body.category,
      place: req.body.place,
      age: req.body.age,
      workType: req.body.workType,
      timeSlot: req.body.timeSlot,
      reference: {
        name: req.body.reference_name,
        contact: req.body.mobile
      },
      day: req.body.day,
      matterOfInterest: req.body.profession,
      image: imagePath,
    });

    // Save the volunteer registration data to the database
    await newVolunteer.save();

    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/check-email", async function (req, res, next) {
  try {
    const existingUser = await Volunteer.findOne({ email: req.body.email });
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
