const { default: mongoose } = require("mongoose");
const QnA = require("../models/QnA");

// @desc      CREATE NEW NOTE
// @route     POST /api/v1/qna
// @access    protect
exports.createQna = async (req, res) => {
  try {
    const newNote = await QnA.create(req.body);
    res.status(200).json({
      success: true,
      message: "QnA created successfully",
      data: newNote,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET ALL NOTE
// @route     GET /api/v1/qna
// @access    public
exports.getQna = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await QnA.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific qnas",
        response,
      });
    }

    const query = searchkey
      ? { ...req.filter, qnas: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && QnA.countDocuments(),
      parseInt(skip) === 0 && QnA.countDocuments(query),
      QnA.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 0)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all qnas`,
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

// @desc      UPDATE SPECIFIC NOTE
// @route     PUT /api/v1/qna/:id
// @access    protect
exports.updateQna = async (req, res) => {
  try {
    const qnas = await QnA.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!qnas) {
      return res.status(404).json({
        success: false,
        message: "QnA not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "QnA updated successfully",
      data: qnas,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      DELETE SPECIFIC NOTE
// @route     DELETE /api/v1/qna/:id
// @access    protect
exports.deleteQna = async (req, res) => {
  try {
    const qnas = await QnA.findByIdAndDelete(req.query.id);

    if (!qnas) {
      return res.status(404).json({
        success: false,
        message: "QnA not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "QnA deleted successfully",
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
    const items = await QnA.find({}, { _id: 0, id: "$_id", value: "$qnas" });
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};
