var express = require("express");
var router = express.Router();
const AboutUs = require("../models/AboutUs");

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    const aboutData = await AboutUs.find();
    console.log(aboutData);
    res.render("about", { title: "Express", aboutData });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;

