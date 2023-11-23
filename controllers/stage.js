const { default: mongoose } = require("mongoose");
const Stage = require("../models/stage");

// @desc      CREATE NEW STAGE
// @route     POST /api/v1/stage
// @access    protect
exports.createStage = async (req, res) => {
  try {
    const newStage = await Stage.create(req.body);
    res.status(200).json({
      success: true,
      message: "Stage created successfully",
      data: newStage,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET ALL STAGE
// @route     GET /api/v1/stage
// @access    public
exports.getStage = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await Stage.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific stage",
        response,
      });
    }

    const query = searchkey
      ? { ...req.filter, title: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Stage.countDocuments(),
      parseInt(skip) === 0 && Stage.countDocuments(query),
      Stage.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 0)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all stage`,
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

// @desc      UPDATE SPECIFIC STAGE
// @route     PUT /api/v1/stage/:id
// @access    protect
exports.updateStage = async (req, res) => {
  try {
    const stages = await Stage.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!stages) {
      return res.status(404).json({
        success: false,
        message: "Stage not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Stage updated successfully",
      data: stages,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      DELETE SPECIFIC STAGE
// @route     DELETE /api/v1/stage/:id
// @access    protect
exports.deleteStage = async (req, res) => {
  try {
    const stages = await Stage.findByIdAndDelete(req.query.id);

    if (!stages) {
      return res.status(404).json({
        success: false,
        message: "Stage not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Stage deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

exports.select = async (req, res) => {
  try {
    const items = await Stage.find({}, { _id: 0, id: "$_id", value: "$stage" });
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
