const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  try {
    // You can remove the API request part and the related data manipulation

    // You can set a default title or any other data you want to pass to the template
    const title = "Welcome to My Website";

    // Pass the title to the EJS template and render it
    res.render("index", { title });
  } catch (error) {
    console.error("Error:", error);
    res.render("error"); // Render an error template in case of any issues
  }
});

module.exports = router;
