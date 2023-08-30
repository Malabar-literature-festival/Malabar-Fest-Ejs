var express = require("express");
const Gallery = require("../models/Gallery");
var router = express.Router();

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    const galleryData = await Gallery.find()
    console.log(galleryData)
    res.render("gallery",{galleryData});
  } catch (error) {
    console.error(error)
  }
});

module.exports = router;