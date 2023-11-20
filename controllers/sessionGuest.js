const { default: mongoose } = require("mongoose");
const SessionGuest = require("../models/sessionGuest");
const Session = require("../models/session");

// @desc      CREATE NEW SESSION GUEST
// @route     POST /api/v1/session-guest
// @access    protect
exports.createSessionGuest = async (req, res) => {
  try {
    const newSessionGuest = await SessionGuest.create(req.body);
    res.status(200).json({
      success: true,
      message: "Session guest created successfully",
      data: newSessionGuest,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET ALL SESSION GUEST
// @route     GET /api/v1/session-guest
// @access    public
exports.getSessionGuest = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await SessionGuest.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific session guest",
        response,
      });
    }

    const query = searchkey
      ? { ...req.filter, guest: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && SessionGuest.countDocuments(),
      parseInt(skip) === 0 && SessionGuest.countDocuments(query),
      SessionGuest.find(query).populate("session")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all session guest`,
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

// @desc      UPDATE SPECIFIC SESSION GUEST
// @route     PUT /api/v1/session-guest/:id
// @access    protect
exports.updateSessionGuest = async (req, res) => {
  try {
    const sessionGuest = await SessionGuest.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!sessionGuest) {
      return res.status(404).json({
        success: false,
        message: "Session guest not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Session guest updated successfully",
      data: sessionGuest,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      DELETE SPECIFIC SESSION GUEST
// @route     DELETE /api/v1/session-guest/:id
// @access    protect
exports.deleteSessionGuest = async (req, res) => {
  try {
    const sessionGuest = await SessionGuest.findByIdAndDelete(req.query.id);

    if (!sessionGuest) {
      return res.status(404).json({
        success: false,
        message: "Session guest not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Session guest deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET SESSION GUEST
// @route     GET /api/v1/session-guest/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await SessionGuest.find(
      {},
      { _id: 0, id: "$_id", value: "$guest" }
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

// @desc      GET SESSION GUEST BY SESSION
// @route     GET /api/v1/sessionguest-by-session/:sessionId
// @access    public
exports.getSessionGuestBySession = async (req, res) => {
  try {
    const { id } = req.query;
    // console.log('SessionGuest Id:', id);

    // Retrieve sessionGuests with session 
    const sessionGuests = await SessionGuest.findById(id).populate("session");

    res.status(200).json({
      success: true,
      message: 'Retrieved session guests by session',
      response: sessionGuests,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};