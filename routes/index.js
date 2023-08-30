const express = require("express");
const AboutUs = require("../models/AboutUs");
const Speakers = require("../models/Speakers");
const News = require("../models/News");
const Testimonial = require("../models/Testimonial");
const router = express.Router();

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    const title = "Welcome to My Website";

    const aboutData = await AboutUs.find();

    const speakerData = await Speakers.find();

    const newsData = await News.find();

    const testimonialData = await Testimonial.find();
    console.log(testimonialData);
    res.render("index", {
      title,
      aboutData,
      speakerData,
      newsData,
      testimonialData,
    });
  } catch (error) {
    console.error("Error:", error);
  }
});

module.exports = router;
