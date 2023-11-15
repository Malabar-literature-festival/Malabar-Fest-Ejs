const { default: mongoose } = require("mongoose");
const Testimonial = require("../models/Testimonial");

// @desc      CREATE NEW TESTIMONIAL
// @route     POST /api/v1/testimonial
// @access    private
exports.createTestimonial = async (req, res) => {
  try {
    const newTestimonial = await Testimonial.create(req.body);
    res.status(200).json({
      success: true,
      message: "Testimonial created successfully",
      data: newTestimonial,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc      GET TESTIMONIAL
// @route     GET /api/v1/testimonial/:id
// @access    private
exports.getTestimonial = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;
    if (id && mongoose.isValidObjectId(id)) {
      const response = await Testimonial.findById(id);
      return res.status(200).json({
        success: true,
        message: `Retrieved specific testimonial`,
        response,
      });
    }
    const query = {
      ...req.filter,
      ...(searchkey && {
        $or: [
          { title: { $regex: searchkey, $options: "i" } },
          { content: { $regex: searchkey, $options: "i" } },
        ],
      }),
    };
    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Testimonial.countDocuments(),
      parseInt(skip) === 0 && Testimonial.countDocuments(query),
      Testimonial.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 0),
    ]);
    res.status(200).json({
      success: true,
      message: `Retrieved all testimonial`,
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

// @desc      UPDATE SPECIFIC TESTIMONIAL
// @route     PUT /api/v1/testimonial/:id
// @access    private
exports.updateTestimonial = async (req, res) => {
  try {
    const response = await Testimonial.findByIdAndUpdate(
      req.body.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      message: "Updated specific testimonial",
      enrollment: response,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      DELETE SPECIFIC TESTIMONIAL
// @route     DELETE /api/v1/testimonial/:id
// @access    private
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.query.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};
