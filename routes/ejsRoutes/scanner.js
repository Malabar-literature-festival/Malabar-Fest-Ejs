const express = require("express");
const Registration = require("../../models/Registration");
const router = express.Router();

router.get("/", async (req, res) => {
  res.render("scan");
});

router.post("/validateqr", async (req, res) => {
  try {
    console.log(req.body);
    let attended = await Registration.findOne({
      _id: req.body.value,
      attended: true,
    });

    if (!attended) {
      const updateAttended = await Registration.findByIdAndUpdate(
        { _id: req.body.value },
        { attended: true }
      );
      updateAttended = await updateAttended.save();

      updateddata = await Registration.findOne({
        _id: req.body.value,
      });
      console.log(updateddata);
    }
    res.json(updateddata)
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: err });
  }
});

module.exports = router;
