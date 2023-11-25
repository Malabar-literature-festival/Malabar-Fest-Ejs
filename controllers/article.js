const { default: mongoose } = require("mongoose");
const Article = require("../models/article");

// @desc      CREATE ARTICLE
// @route     POST /api/v1/article
// @access    private
exports.createArticle = async (req, res, next) => {
  try {
    const response = await Article.create(req.body);
    res.status(200).json({
      success: true,
      message: "Successfully added article",
      response,
    });
    console.log(response);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      GET ARTICLE
// @route     GET /api/v1/article
// @access    private
exports.getArticle = async (req, res) => {
  try {
    const { id, skip, limit, searchkey } = req.query;
    if (id && mongoose.isValidObjectId(id)) {
      const response = await Article.findById(id);
      return res.status(200).json({
        success: true,
        message: `Retrieved article`,
        response,
      });
    }
    const query = searchkey
      ? { ...req.filter, title: { $regex: searchkey, $options: "i" } }
      : req.filter;
    const [totalCount, filterCount, data] = await Promise.all([
      parseInt(skip) === 0 && Article.countDocuments(),
      parseInt(skip) === 0 && Article.countDocuments(query),
      Article.find(query)
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 0),
    ]);
    res.status(200).json({
      success: true,
      message: `Retrieved all article`,
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

// @desc      UPDATE ARTICLE
// @route     PUT /api/v1/article
// @access    private
exports.updateArticle = async (req, res) => {
  try {
    const response = await Article.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Updated specific article",
      response,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.toString(),
    });
  }
};

// @desc      DELETE ARTICLE
// @route     DELETE /api/v1/article
// @access    private
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.query.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err,
    });
  }
};

// @desc      GET ARTICLE
// @route     GET /api/v1/article/select
// @access    protect
exports.select = async (req, res) => {
    try {
        const items = await Article.find({}, { _id: 0, id: "$_id", value: "$title" });
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