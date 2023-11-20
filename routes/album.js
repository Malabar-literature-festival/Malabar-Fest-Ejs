const router = require("express").Router();
// Controllers
const {
  createAlbum,
  getAlbum,
  updateAlbum,
  deleteAlbum,
  select,
  // getByFranchise,
} = require("../controllers/album");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
  .route("/")
  .post(
    getUploadMiddleware("uploads/gallery", ["image"]),
    getS3Middleware(["image"]),
    createAlbum
  )
  .get(reqFilter, getAlbum)
  .put(
    getUploadMiddleware("uploads/gallery", ["image"]),
    getS3Middleware(["image"]),
    updateAlbum
  )
  .delete(deleteAlbum);

router.get("/select", reqFilter, select);

module.exports = router;
