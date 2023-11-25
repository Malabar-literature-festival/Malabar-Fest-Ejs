const { default: mongoose } = require("mongoose");
const Banners = require("../models/banners");

// @desc      CREATE BANNERS
// @route     POST /api/v1/banners
// @access    private
exports.createBanners = async (req, res, next) => {
  try {
    const response = await Banners.create(req.body);
    res.status(200).json({
      success: true,
      message: "Successfully added banners",
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

// @desc      GET BANNERS
// @route     GET /api/v1/banners
// @access    private
exports.getBanners = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;
    if (id && mongoose.isValidObjectId(id)) {
      const response = await Banners.findById(id);
      return res.status(200).json({
        success: true,
        message: `Retrieved banners`,
        response,
      });
    }
    const query = searchkey
      ? { ...req.filter, title: { $regex: searchkey, $options: "i" } }
      : req.filter;
    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Banners.countDocuments(),
      parseInt(skip) === 0 && Banners.countDocuments(query),
      Banners.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 0),
    ]);
    res.status(200).json({
      success: true,
      message: `Retrieved all banners`,
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

// @desc      UPDATE BANNERS
// @route     PUT /api/v1/banners
// @access    private
exports.updateBanners = async (req, res) => {
  try {
    const response = await Banners.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Updated specific banners",
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

// @desc      DELETE BANNERS
// @route     DELETE /api/v1/banners
// @access    private
exports.deleteBanners = async (req, res) => {
  try {
    const banners = await Banners.findByIdAndDelete(req.query.id);

    if (!banners) {
      return res.status(404).json({
        success: false,
        message: "Banners not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Banners deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};