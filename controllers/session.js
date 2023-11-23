const { default: mongoose } = require("mongoose");
const Session = require("../models/session");
const sessionGuest = require("../models/sessionGuest");
const session = require("../models/session");

// @desc      CREATE NEW SESSION
// @route     POST /api/v1/session
// @access    protect
exports.createSession = async (req, res) => {
  try {
    const newSession = await Session.create(req.body);
    res.status(200).json({
      success: true,
      message: "Session created successfully",
      data: newSession,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET ALL SESSION
// @route     GET /api/v1/session
// @access    public
exports.getSession = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await Session.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific session",
        response,
      });
    }

    const query = searchkey
      ? { ...req.filter, day: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Session.countDocuments(),
      parseInt(skip) === 0 && Session.countDocuments(query),
      Session.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 50)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all session`,
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

// @desc      UPDATE SPECIFIC SESSION
// @route     PUT /api/v1/session/:id
// @access    protect
exports.updateSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Session updated successfully",
      data: session,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      DELETE SPECIFIC SESSION
// @route     DELETE /api/v1/session/:id
// @access    protect
exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.query.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Session deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET SESSION
// @route     GET /api/v1/session/select
// @access    protect
exports.select = async (req, res) => {
  try {
    const items = await Session.find(
      {},
      { _id: 0, id: "$_id", value: "$title" }
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

// @desc      GET SESSION BY DAY
// @route     GET /api/v1/session-by-day
// @access    public
exports.getSessionByDay = async (req, res) => {
  try {
    const { day } = req.query;

    const aggregationPipeline = [
      {
        $match: day ? { day: day } : {},
      },
      {
        $lookup: {
          from: "sessionguests",
          localField: "sessionGuests",
          foreignField: "_id",
          as: "guestDetails",
        },
      },
      {
        $unwind: {
          path: "$guestDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "guestroles",
          localField: "guestDetails.guestRole",
          foreignField: "_id",
          as: "guestDetails.guestRoleDetails",
        },
      },
      {
        $group: {
          _id: { stage: "$stage" },
          sessions: {
            $push: {
              _id: "$_id",
              startTime: "$startTime",
              endTime: "$endTime",
              title: "$title",
              guestDetails: {
                _id: "$guestDetails._id",
                guest: "$guestDetails.guest",
                description: "$guestDetails.description",
                order: "$guestDetails.order",
                session: "$guestDetails.session",
                photo: "$guestDetails.photo",
                guestRoleDetails: "$guestDetails.guestRoleDetails",
              },
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          stages: {
            $addToSet: {
              stage: "$_id.stage",
              sessions: "$sessions",
            },
          },
        },
      },
      {
        $unwind: "$stages",
      },
      {
        $unwind: "$stages.sessions",
      },
      {
        $group: {
          _id: "$stages.stage",
          sessions: {
            $push: "$stages.sessions",
          },
        },
      },
      {
        $group: {
          _id: null,
          stages: {
            $push: {
              stage: "$_id",
              sessions: "$sessions",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          stages: 1,
        },
      },
    ];

    const sessionsByDay = await Session.aggregate(aggregationPipeline);

    res.status(200).json({
      success: true,
      message: day
        ? `Retrieved sessions for day '${day}'`
        : "Retrieved sessions for all days",
      response: sessionsByDay,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};
