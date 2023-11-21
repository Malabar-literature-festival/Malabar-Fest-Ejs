const { default: mongoose } = require("mongoose");
const Feedback = require("../models/Feedback");

// @desc      CREATE NEW FEEDBACK
// @route     POST /api/v1/feedback
// @access    protect
exports.createFeedback = async (req, res) => {
  try {
    const newFeedback = await Feedback.create(req.body);
    res.status(200).json({
      success: true,
      message: "Feedback created successfully",
      data: newFeedback,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET ALL FEEDBACK
// @route     GET /api/v1/feedback
// @access    public
exports.getFeedback = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await Feedback.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific feedback",
        response,
      });
    }

    const query = searchkey
      ? { ...req.filter, description: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Feedback.countDocuments(),
      parseInt(skip) === 0 && Feedback.countDocuments(query),
      Feedback.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 0)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all feedback`,
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

// @desc      UPDATE SPECIFIC FEEDBACK
// @route     PUT /api/v1/feedback/:id
// @access    protect
exports.updateFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!feedbacks) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Feedback updated successfully",
      data: feedbacks,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      DELETE SPECIFIC FEEDBACK
// @route     DELETE /api/v1/feedback/:id
// @access    protect
exports.deleteFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.findByIdAndDelete(req.query.id);

    if (!feedbacks) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Feedback deleted successfully",
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
    const items = await Feedback.find({}, { _id: 0, id: "$_id", value: "$description" });
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};
