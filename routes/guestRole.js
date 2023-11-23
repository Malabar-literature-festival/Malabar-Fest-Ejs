const router = require("express").Router();
// Controllers
const {
  createGuestRole,
  getGuestRole,
  updateGuestRole,
  deleteGuestRole,
  select,
  // getByFranchise,
} = require("../controllers/guestRole");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(createGuestRole)
  .get(reqFilter, getGuestRole)
  .put(updateGuestRole)
  .delete(deleteGuestRole);

router.get("/select", reqFilter, select);

module.exports = router;
