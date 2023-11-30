const { default: mongoose } = require("mongoose");
const Note = require("../models/Note");

// @desc      CREATE NEW NOTE
// @route     POST /api/v1/note
// @access    protect
exports.createNote = async (req, res) => {
  try {
    const newNote = await Note.create(req.body);
    res.status(200).json({
      success: true,
      message: "Note created successfully",
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
// @route     GET /api/v1/note
// @access    public
exports.getNote = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;

    if (id && mongoose.isValidObjectId(id)) {
      const response = await Note.findById(id);
      return res.status(200).json({
        success: true,
        message: "Retrieved specific notes",
        response,
      });
    }

    const query = searchkey
      ? { ...req.filter, notes: { $regex: searchkey, $options: "i" } }
      : req.filter;

    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Note.countDocuments(),
      parseInt(skip) === 0 && Note.countDocuments(query),
      Note.find(query)
        .populate("session")
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 0)
        .sort({ _id: -1 }),
    ]);

    res.status(200).json({
      success: true,
      message: `Retrieved all notes`,
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
// @route     PUT /api/v1/note/:id
// @access    protect
exports.updateNote = async (req, res) => {
  try {
    const notes = await Note.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });

    if (!notes) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: notes,
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
// @route     DELETE /api/v1/note/:id
// @access    protect
exports.deleteNote = async (req, res) => {
  try {
    const notes = await Note.findByIdAndDelete(req.query.id);

    if (!notes) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
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
    const items = await Note.find({}, { _id: 0, id: "$_id", value: "$notes" });
    return res.status(200).send(items);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};
