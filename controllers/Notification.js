const { default: mongoose } = require("mongoose");
const Notification = require("../models/Notification");
const axios = require("axios");

// @desc      CREATE NEW NOTE
// @route     POST /api/v1/notification
// @access    protect
exports.createNotification = async (req, res) => {
  try {
    // Create the notification in your database
    const newNote = await Notification.create(req.body);

    // Prepare the OneSignal API request payload
    const oneSignalPayload = {
      included_segments: ["All"],
      app_id: process.env.APP_ID,
      contents: {
        en: `${req.body.description}`,
      },
      name: "INTERNAL_CMPAIGN_NAME",
      headings: {
        en: `${req.body.title}`,
      },
      big_picture: `https://event-manager.syd1.cdn.digitaloceanspaces.com/${req.body.image}`,
      // include_player_ids: ["207c51ee-95ed-4f25-a8f5-5c087ae34ca8"],
    };

    // Make the OneSignal API request
    const oneSignalResponse = await axios.post(
      "https://onesignal.com/api/v1/notifications",
      oneSignalPayload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY}`, // Replace with your OneSignal REST API key
        },
      }
    );

    // Handle the OneSignal API response if needed
    console.log("OneSignal API Response:", oneSignalResponse.data);

    // Respond to the client with the success message and created notification data
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
    const notifications = await Notification.findByIdAndUpdate(
      req.body.id,
      req.body,
      {
        new: true,
      }
    );

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
    const items = await Notification.find(
      {},
      { _id: 0, id: "$_id", value: "$notifications" }
    );
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};
