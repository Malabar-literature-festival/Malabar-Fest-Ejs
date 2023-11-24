const { default: mongoose } = require("mongoose");
const Day = require("../models/day");

// @desc      CREATE DAY
// @route     POST /api/v1/day
// @access    private
exports.createDay = async (req, res, next) => {
  try {
    const response = await Day.create(req.body);
    res.status(200).json({
      success: true,
      message: "Successfully added day",
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

// @desc      GET DAY
// @route     GET /api/v1/day
// @access    private
exports.getDay = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;
    if (id && mongoose.isValidObjectId(id)) {
      const response = await Day.findById(id);
      return res.status(200).json({
        success: true,
        message: `Retrieved day`,
        response,
      });
    }
    const query = searchkey
      ? { ...req.filter, day: { $regex: searchkey, $options: "i" } }
      : req.filter;
    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Day.countDocuments(),
      parseInt(skip) === 0 && Day.countDocuments(query),
      Day.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 0),
    ]);
    res.status(200).json({
      success: true,
      message: `Retrieved all day`,
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

// @desc      UPDATE DAY
// @route     PUT /api/v1/day
// @access    private
exports.updateDay = async (req, res) => {
  try {
    const response = await Day.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Updated specific day",
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

// @desc      DELETE DAY
// @route     DELETE /api/v1/day
// @access    private
exports.deleteDay = async (req, res) => {
  try {
    const day = await Day.findByIdAndDelete(req.query.id);

    if (!day) {
      return res.status(404).json({
        success: false,
        message: "Day not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Day deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET DAY
// @route     GET /api/v1/day/select
// @access    protect
exports.select = async (req, res) => {
    try {
      const items = await Session.find(
        {},
        { _id: 0, id: "$_id", value: "$day" }
      );
      return res.status(200).send(items);
    } catch (err) {
      console.log(err);
      res.status(204).json({
        success: false,
        message: err,
      });
    }
  };