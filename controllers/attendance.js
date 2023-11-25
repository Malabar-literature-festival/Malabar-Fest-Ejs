const { default: mongoose } = require("mongoose");
const Attendance = require("../models/attendance");

// @desc      CREATE NEW ATTENDANCE
// @route     POST /api/v1/attendance
// @access    protect
exports.createAttendance = async (req, res) => {
    try {
        const newAttendance = await Attendance.create(req.body);
        res.status(200).json({
            success: true,
            message: "Attendance created successfully",
            data: newAttendance,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err,
        });
    }
};

// @desc      GET ALL ATTENDANCE
// @route     GET /api/v1/attendance
// @access    public
exports.getAttendance = async (req, res) => {
    try {
        const { id, skip, limit, searchkey } = req.query;

        if (id && mongoose.isValidObjectId(id)) {
            const response = await Attendance.findById(id);
            return res.status(200).json({
                success: true,
                message: "Retrieved specific attendance",
                response,
            });
        }

        const query = searchkey
            ? { ...req.filter, day: { $regex: searchkey, $options: "i" } }
            : req.filter;

        const [totalCount, filterCount, data] = await Promise.all([
            parseInt(skip) === 0 && Attendance.countDocuments(),
            parseInt(skip) === 0 && Attendance.countDocuments(query),
            Attendance.find(query)
                .populate("user")
                .populate("day")
                .skip(parseInt(skip) || 0)
                .limit(parseInt(limit) || 0)
                .sort({ _id: -1 }),
        ]);

        res.status(200).json({
            success: true,
            message: `Retrieved all attendance`,
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

// @desc      UPDATE SPECIFIC ATTENDANCE
// @route     PUT /api/v1/attendance/:id
// @access    protect
exports.updateAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.findByIdAndUpdate(req.body.id, req.body, {
            new: true,
        });

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: "Attendance not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Attendance updated successfully",
            data: attendance,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err,
        });
    }
};

// @desc      DELETE SPECIFIC ATTENDANCE
// @route     DELETE /api/v1/attendance/:id
// @access    protect
exports.deleteAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.findByIdAndDelete(req.query.id);

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: "Attendance not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Attendance deleted successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err,
        });
    }
};

// @desc      GET ATTENDANCE
// @route     GET /api/v1/attendance/select
// @access    protect
exports.select = async (req, res) => {
    try {
        const items = await Attendance.find({}, { _id: 0, id: "$_id", value: "$day" });
        console.log(items);
        return res.status(200).send(items);
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err.toString(),
        });
    }
};
