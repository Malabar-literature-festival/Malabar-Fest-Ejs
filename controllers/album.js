const { default: mongoose } = require("mongoose");
const Album = require("../models/Album");

// @desc      CREATE NEW ALBUM
// @route     POST /api/v1/gallery
// @access    protect
exports.createAlbum = async (req, res) => {
  try {
    const newGallery = await Album.create(req.body);
    res.status(200).json({
      success: true,
      message: "Album created successfully",
      data: newGallery,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET ALL ALBUM
// @route     GET /api/v1/gallery
// @access    public
exports.getAlbum = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await Album.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific gallery",
        response,
      });
    }

    const query = searchkey
      ? { ...req.filter, title: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Album.countDocuments(),
      parseInt(skip) === 0 && Album.countDocuments(query),
      Album.find(query)
        .populate("images")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 0)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all gallery`,
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

// @desc      UPDATE SPECIFIC ALBUM
// @route     PUT /api/v1/gallery/:id
// @access    protect
exports.updateAlbum = async (req, res) => {
  try {
    const gallerys = await Album.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!gallerys) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Album updated successfully",
      data: gallerys,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      DELETE SPECIFIC ALBUM
// @route     DELETE /api/v1/gallery/:id
// @access    protect
exports.deleteAlbum = async (req, res) => {
  try {
    const gallerys = await Album.findByIdAndDelete(req.query.id);

    if (!gallerys) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Album deleted successfully",
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
    const items = await Album.find({}, { _id: 0, id: "$_id", value: "$name" });
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};
