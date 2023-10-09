const express = require("express");
const Registration = require("../../models/Registration");
const { default: mongoose } = require("mongoose");
const router = express.Router();

router.get("/", async (req, res) => {
  res.render("scan");
});

router.post("/validateqr", async (req, res) => {
  try {
    console.log(req.body);
    const value = req.body.value;
    const result = value.replace(/"/g, "");
    console.log(result.replace(/"/g, ""));

    const objectId = new mongoose.Types.ObjectId(result);

    console.log(objectId);

    let attended = await Registration.findOne({
      _id: result,
      attended: true,
    });

    console.log(attended, "123456789");
    if (!attended) {
      const updateAttended = await Registration.findByIdAndUpdate(result, {
        attended: true,
      });
      updateAttended = await updateAttended.save();

      updateddata = await Registration.findOne({
        _id: result,
      });
      console.log(updateddata);
      res.json(updateddata);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

module.exports = router;
