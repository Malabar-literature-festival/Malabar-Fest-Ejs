var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("events", {
    title:
      "Malabar Literature Festival | Celebrating History, Language, and Culture",
  });
});

module.exports = router;
