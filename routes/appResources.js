const router = require("express").Router();
// Controllers
const {
  createAppResources,
  getAppResources,
  updateAppResources,
  deleteAppResources,
  // getByFranchise,
} = require("../controllers/appResources");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
  .route("/")
  .post(
    getUploadMiddleware("uploads/appResources", ["homePageBanner", "partnersAndSponsors", "ticketImage", "eventImage", "selfieImage"]),
    getS3Middleware(["homePageBanner", "partnersAndSponsors", "ticketImage", "eventImage", "selfieImage"]),
    createAppResources
  )
  .get(reqFilter, getAppResources)
  .put(
    getUploadMiddleware("uploads/appResources", ["homePageBanner", "partnersAndSponsors", "ticketImage", "eventImage", "selfieImage"]),
    getS3Middleware(["homePageBanner", "partnersAndSponsors", "ticketImage", "eventImage", "selfieImage"]),
    updateAppResources
  )
  .delete(deleteAppResources);

module.exports = router;
