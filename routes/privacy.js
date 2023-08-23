var express = require("express");
var router = express.Router();
const AboutUs = require("../models/AboutUs");

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    res.render("privacy", { title: "Express" });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;