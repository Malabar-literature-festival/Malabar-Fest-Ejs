var express = require("express");
var router = express.Router();
const upload = require("../middleware/upload");
const Registration = require("../models/Registration");
const bcrypt = require("bcrypt");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("student");
});

router.post("/", upload.single("photo"), async function (req, res, next) {
  try {
    console.log(req.body);
    const imagePath = req.file ? req.file.path : null;
    console.log(imagePath);

    // Check if a user with the same email already exists
    const existingUser = await Registration.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newRegistration = new Registration({
      regType: req.body.type,
      name: req.body.name,
      gender: req.body.gender,
      mobileNumber: req.body.contact,
      email: req.body.email,
      password: hashedPassword,
      profession: req.body.profession,
      regDate: req.body.day,
      matterOfInterest: req.body.interest,
      institution: req.body.institution,
      category: req.body.category,
      image: imagePath,
    });

    // Save the registration data to the database
    await newRegistration.save();

    return res.sendStatus(200);
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
