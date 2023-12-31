const router = require("express").Router();
// Controllers
const {
  createFeedback,
  getFeedback,
  updateFeedback,
  deleteFeedback,
  select,
  // getByFranchise,
} = require("../../controllers/feedback");
// Middleware
const { protect, authorize } = require("../../middleware/auth");
const { reqFilter } = require("../../middleware/filter");

router
  .route("/")
  .post(createFeedback)
  .get(reqFilter, getFeedback)
  .put(updateFeedback)
  .delete(deleteFeedback);

router.get("/select", reqFilter, select);

module.exports = router;
