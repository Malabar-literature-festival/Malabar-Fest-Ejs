var express = require("express");
const News = require("../models/News");
var router = express.Router();

/* GET home page. */
router.get("/:id", async function (req, res, next) {
  try {
    const id = req.params.id
    console.log(id)
    const newsData = await News.findById(id)
    const news = await News.find()
    console.log(newsData)
    res.render("news", { title: "Express", newsData, news });
  } catch (error) {
    console.error(error)
  }
});

module.exports = router;
