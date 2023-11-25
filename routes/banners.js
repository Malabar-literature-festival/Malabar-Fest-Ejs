const router = require("express").Router();
// Controllers
const {
  createBanners,
  getBanners,
  updateBanners,
  deleteBanners,
} = require("../controllers/banners");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
  .route("/")
  .post(
    getUploadMiddleware("uploads/banners", ["image"]),
    getS3Middleware(["image"]),
    createBanners
  )
  .get(reqFilter, getBanners)
  .put(
    getUploadMiddleware("uploads/banners", ["image"]),
    getS3Middleware(["image"]),
    updateBanners
  )
  .delete(deleteBanners);

module.exports = router;
