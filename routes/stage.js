const router = require("express").Router();
// Controllers
const {
  createStage,
  getStage,
  updateStage,
  deleteStage,
  select,
  // getByFranchise,
} = require("../controllers/stage");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(createStage)
  .get(reqFilter, getStage)
  .put(updateStage)
  .delete(deleteStage);

router.get("/select", reqFilter, select);

module.exports = router;
