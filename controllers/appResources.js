const { default: mongoose } = require("mongoose");
const AppResources = require("../models/appResources");

// @desc      CREATE NEW APP RESOURCES
// @route     POST /api/v1/app-resources
// @access    protect
exports.createAppResources = async (req, res) => {
  try {
    const newAppResources = await AppResources.create(req.body);
    res.status(200).json({
      success: true,
      message: "App resources created successfully",
      data: newAppResources,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET ALL APP RESOURCES
// @route     GET /api/v1/app-resources
// @access    public
exports.getAppResources = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await AppResources.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific app resources",
        response,
      });
    }

    const query = searchkey
      ? { ...req.filter, name: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && AppResources.countDocuments(),
      parseInt(skip) === 0 && AppResources.countDocuments(query),
      AppResources.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 0)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all app resources`,
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

// @desc      UPDATE SPECIFIC APP RESOURCES
// @route     PUT /api/v1/app-resources/:id
// @access    protect
exports.updateAppResources = async (req, res) => {
  try {
    const photos = await AppResources.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!photos) {
      return res.status(404).json({
        success: false,
        message: "App resources not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "App resources updated successfully",
      data: photos,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      DELETE SPECIFIC APP RESOURCES
// @route     DELETE /api/v1/app-resources/:id
// @access    protect
exports.deleteAppResources = async (req, res) => {
  try {
    const photos = await AppResources.findByIdAndDelete(req.query.id);

    if (!photos) {
      return res.status(404).json({
        success: false,
        message: "App resources not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "App resources deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET APP RESOURCESS
// @route     GET /api/v1/app-resources/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await AppResources.find(
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
