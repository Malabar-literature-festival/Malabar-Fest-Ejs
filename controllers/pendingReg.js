const { default: mongoose, isValidObjectId } = require("mongoose");
const Registration = require("../models/Registration");
const TempReg = require("../models/TempReg");
const { encrypt } = require("../middleware/ccavutil");
const dotenv = require("dotenv"); // Import dotenv
const crypto = require("crypto");
const qs = require("querystring");
const axios = require("axios");
dotenv.config();

// @desc      CREATE NEW REGISTRATION
// @route     POST /api/v1/registration
// @access    private
exports.createRegistration = async (req, res) => {
  try {
    const newRegistration = await TempReg.create(req.body);
    res.status(200).json({
      success: true,
      message: "Registration created successfully",
      data: newRegistration,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc      GET REGISTRATION
// @route     GET /api/v1/registration/:id
// @access    private
exports.getRegistration = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;
    if (id && mongoose.isValidObjectId(id)) {
      const response = await TempReg.findById(id);
      return res.status(200).json({
        success: true,
        message: `Retrieved specific registration`,
        response,
      });
    }
    const query = {
      ...req.filter,
      ...(searchkey && {
        $or: [
          { name: { $regex: searchkey, $options: "i" } },
          { mobileNumber: { $regex: searchkey, $options: "i" } },
        ],
      }),
      paymentStatus: { $nin: ["success", "Failed", "Success", "failed"] }, // Exclude "success" and "failed" paymentStatus
    };
    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && TempReg.countDocuments(),
      parseInt(skip) === 0 && TempReg.countDocuments(query),
      TempReg.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50),
    ]);
    res.status(200).json({
      success: true,
      message: `Retrieved all registration`,
      response: data,
      count: data.length,
      totalCount: totalCount || 0,
      filterCount: filterCount || 0,
    });
  } catch (err) {
    console.log(err);
    res.status(204).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      UPDATE SPECIFIC REGISTRATION
// @route     PUT /api/v1/registration/:id
// @access    private
exports.updateRegistration = async (req, res) => {
  try {
    const response = await TempReg.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Updated specific registration",
      enrollment: response,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      DELETE SPECIFIC REGISTRATION
// @route     DELETE /api/v1/registration/:id
// @access    private
exports.deleteRegistration = async (req, res) => {
  try {
    const registration = await TempReg.findByIdAndDelete(req.query.id);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Registration deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};
