var express = require("express");
var router = express.Router();
const upload = require("../../middleware/uploadEjs");
const Volunteer = require("../../models/Volunteer");
const bcrypt = require("bcrypt");

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
  res.render("volunter", { title, metaTags });
});

router.post("/", upload.single("photo"), async function (req, res, next) {
  try {
    const imagePath = req.file ? req.file.path : null;
    console.log(req.body);
    console.log(imagePath);

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
        contact: req.body.mobile,
      },
      day: req.body.day,
      matterOfInterest: req.body.interest,
      image: imagePath,
    });

    // Save the volunteer registration data to the database
    await newVolunteer.save();

    return res.status(200);
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
