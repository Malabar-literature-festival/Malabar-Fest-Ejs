const { default: mongoose } = require("mongoose");
const Speakers = require("../models/Speakers");

// @desc      CREATE NEW SPEAKERS
// @route     POST /api/v1/speakers
// @access    private
exports.createSpeakers = async (req, res) => {
  try {
    const newSpeakers = await Speakers.create(req.body);
    res.status(200).json({
      success: true,
      message: "Speakers created successfully",
      data: newSpeakers,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc      GET SPEAKERS
// @route     GET /api/v1/speakers/:id
// @access    private
exports.getSpeakers = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;
    if (id && mongoose.isValidObjectId(id)) {
      const response = await Speakers.findById(id);
      return res.status(200).json({
        success: true,
        message: `Retrieved specific speakers`,
        response,
      });
    }
    const query = {
      ...req.filter,
      ...(searchkey && {
        $or: [
          { name: { $regex: searchkey, $options: "i" } },
          { designation: { $regex: searchkey, $options: "i" } },
        ],
      }),
    };
    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Speakers.countDocuments(),
      parseInt(skip) === 0 && Speakers.countDocuments(query),
      Speakers.find(query)
        // .populate("franchise")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 0),
    ]);
    res.status(200).json({
      success: true,
      message: `Retrieved all speakers`,
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

// @desc      UPDATE SPECIFIC SPEAKERS
// @route     PUT /api/v1/speakers/:id
// @access    private
exports.updateSpeakers = async (req, res) => {
  try {
    const response = await Speakers.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Updated specific speakers",
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

// @desc      DELETE SPECIFIC SPEAKERS
// @route     DELETE /api/v1/speakers/:id
// @access    private
exports.deleteSpeakers = async (req, res) => {
  try {
    const speakers = await Speakers.findByIdAndDelete(req.query.id);

    if (!speakers) {
      return res.status(404).json({
        success: false,
        message: "Speakers not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Speakers deleted successfully",
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
    const items = await Speakers.find(
      {},
      { _id: 0, id: "$_id", value: "$name" }
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