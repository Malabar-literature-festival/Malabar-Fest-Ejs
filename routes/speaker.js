var express = require("express");
var router = express.Router();
const Speakers = require("../models/Speakers");

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    const speakerData = await Speakers.find();
    console.log(speakerData);
    res.render("speaker", { title: "Express", speakerData });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
