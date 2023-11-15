const { default: mongoose } = require("mongoose");
const Volunteer = require("../models/Volunteer");

// @desc      CREATE FAQ
// @route     POST /api/v1/volunteer
// @access    private
exports.createVolunteer = async (req, res, next) => {
  try {
    const response = await Volunteer.create(req.body);
    res.status(200).json({
      success: true,
      message: "Successfully added volunteer",
      response,
    });
    console.log(response);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      GET FAQ
// @route     GET /api/v1/volunteer
// @access    private
exports.getVolunteer = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;
    if (id && mongoose.isValidObjectId(id)) {
      const response = await Volunteer.findById(id);
      return res.status(200).json({
        success: true,
        message: `Retrieved volunteer`,
        response,
      });
    }
    const query = searchkey
      ? { ...req.filter, question: { $regex: searchkey, $options: "i" } }
      : req.filter;
    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Volunteer.countDocuments(),
      parseInt(skip) === 0 && Volunteer.countDocuments(query),
      Volunteer.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 0),
    ]);
    res.status(200).json({
      success: true,
      message: `Retrieved all volunteer`,
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

// @desc      UPDATE FAQ
// @route     PUT /api/v1/volunteer
// @access    private
exports.updateVolunteer = async (req, res) => {
  try {
    const response = await Volunteer.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Updated specific volunteer",
      response,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      DELETE FAQ
// @route     DELETE /api/v1/volunteer
// @access    private
exports.deleteVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.query.id);

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Volunteer deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};
