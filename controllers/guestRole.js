const { default: mongoose } = require("mongoose");
const GuestRole = require("../models/guestRole");

// @desc      CREATE NEW GUEST ROLE
// @route     POST /api/v1/guest-role
// @access    protect
exports.createGuestRole = async (req, res) => {
  try {
    const newGuestRole = await GuestRole.create(req.body);
    res.status(200).json({
      success: true,
      message: "Guest role created successfully",
      data: newGuestRole,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET ALL GUEST ROLE
// @route     GET /api/v1/guest-role
// @access    public
exports.getGuestRole = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await GuestRole.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific guest role",
        response,
      });
    }

    const query = searchkey
      ? { ...req.filter, title: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && GuestRole.countDocuments(),
      parseInt(skip) === 0 && GuestRole.countDocuments(query),
      GuestRole.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 0)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all guest role`,
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

// @desc      UPDATE SPECIFIC GUEST ROLE
// @route     PUT /api/v1/guest-role/:id
// @access    protect
exports.updateGuestRole = async (req, res) => {
  try {
    const guestRoles = await GuestRole.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!guestRoles) {
      return res.status(404).json({
        success: false,
        message: "Guest role not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Guestrole updated successfully",
      data: guestRoles,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      DELETE SPECIFIC GUEST ROLE
// @route     DELETE /api/v1/guest-role/:id
// @access    protect
exports.deleteGuestRole = async (req, res) => {
  try {
    const guestRoles = await GuestRole.findByIdAndDelete(req.query.id);

    if (!guestRoles) {
      return res.status(404).json({
        success: false,
        message: "Guest role not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Guest role deleted successfully",
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
    const items = await GuestRole.find({}, { _id: 0, id: "$_id", value: "$title" });
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};
