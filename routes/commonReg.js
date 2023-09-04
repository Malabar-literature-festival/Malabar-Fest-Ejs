var express = require("express");
const Registration = require("../models/Registration");
var router = express.Router();
// const bcrypt = require('bcrypt')

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("commonReg")
});

router.post("/", async function (req, res, next) {
    try {
      console.log(req.body);
  
      // Check if a user with the same email already exists
      const existingUser = await Registration.findOne({ email: req.body.email });
      console.log("Existing user In common Reg :", existingUser)
      if (existingUser) {
        return res.redirect('/register');
      }
  
    //   const hashedPassword = await bcrypt.hash(req.body.password, 10);
      
      const newRegistration = new Registration({
        commonReg: req.body.type,
        name: req.body.name,
        gender: req.body.gender,
        mobileNumber: req.body.contact,
        email: req.body.email,
        // password: hashedPassword,
      });
  
      // Save the registration data to the database
      await newRegistration.save();
  
      return res.status(200).redirect('/register')
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

module.exports = router;
