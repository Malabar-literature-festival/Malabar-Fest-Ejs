const router = require("express").Router();
// Controllers
const {
  createArticle,
  getArticle,
  updateArticle,
  deleteArticle,
  select,
} = require("../controllers/article");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
  .route("/")
  .post(
    getUploadMiddleware("uploads/article", ["image"]),
    getS3Middleware(["image"]),
    createArticle
  )
  .get(reqFilter, getArticle)
  .put(
    getUploadMiddleware("uploads/article", ["image"]),
    getS3Middleware(["image"]),
    updateArticle
  )
  .delete(deleteArticle);
router.get("/select", reqFilter, select);

module.exports = router;
