const { default: mongoose } = require("mongoose");
const ProgramLocation = require("../models/programLocation");

// @desc      CREATE NEW PROGRAM LOCATION
// @route     POST /api/v1/program-location
// @access    protect
exports.createProgramLocation = async (req, res) => {
  try {
    const newProgramLocation = await ProgramLocation.create(req.body);
    res.status(200).json({
      success: true,
      message: "Program location created successfully",
      data: newProgramLocation,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET ALL PROGRAM LOCATION
// @route     GET /api/v1/program-location
// @access    public
exports.getProgramLocation = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await ProgramLocation.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific program location",
        response,
      });
    }

    const query = searchkey
      ? { ...req.filter, location: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && ProgramLocation.countDocuments(),
      parseInt(skip) === 0 && ProgramLocation.countDocuments(query),
      ProgramLocation.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 0)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all program location`,
      response: data,
      count: data.length,
      totalCount: totalCount || 0,
      filterCount: filterCount || 0,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      UPDATE SPECIFIC PROGRAM LOCATION
// @route     PUT /api/v1/program-location/:id
// @access    protect
exports.updateProgramLocation = async (req, res) => {
  try {
    const programLocation = await ProgramLocation.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!programLocation) {
      return res.status(404).json({
        success: false,
        message: "Program location not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Program location updated successfully",
      data: programLocation,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      DELETE SPECIFIC PROGRAM LOCATION
// @route     DELETE /api/v1/program-location/:id
// @access    protect
exports.deleteProgramLocation = async (req, res) => {
  try {
    const programLocation = await ProgramLocation.findByIdAndDelete(req.query.id);

    if (!programLocation) {
      return res.status(404).json({
        success: false,
        message: "Program location not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Program location deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET PROGRAM LOCATION
// @route     GET /api/v1/program-location/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await ProgramLocation.find({}, { _id: 0, id: "$_id", value: "$stage" });
    console.log(items);
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};
