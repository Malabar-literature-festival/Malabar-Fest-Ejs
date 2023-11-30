const { default: mongoose } = require("mongoose");
const Notification = require("../models/Notification");

// @desc      CREATE NEW NOTE
// @route     POST /api/v1/notification
// @access    protect
exports.createNotification = async (req, res) => {
  try {
    const newNote = await Notification.create(req.body);
    res.status(200).json({
      success: true,
      message: "Notification created successfully",
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
// @route     GET /api/v1/notification
// @access    public
exports.getNotification = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await Notification.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific notifications",
        response,
      });
    }

    const query = searchkey
      ? { ...req.filter, notifications: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Notification.countDocuments(),
      parseInt(skip) === 0 && Notification.countDocuments(query),
      Notification.find(query)
        .populate("session")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 0)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all notifications`,
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
// @route     PUT /api/v1/notification/:id
// @access    protect
exports.updateNotification = async (req, res) => {
  try {
    const notifications = await Notification.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!notifications) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification updated successfully",
      data: notifications,
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
// @route     DELETE /api/v1/notification/:id
// @access    protect
exports.deleteNotification = async (req, res) => {
  try {
    const notifications = await Notification.findByIdAndDelete(req.query.id);

    if (!notifications) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
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
    const items = await Notification.find({}, { _id: 0, id: "$_id", value: "$notifications" });
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};
