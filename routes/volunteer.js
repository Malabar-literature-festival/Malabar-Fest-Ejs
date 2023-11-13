const router = require("express").Router();
// Controllers
const {
  createVolunteer,
  getVolunteer,
  updateVolunteer,
  deleteVolunteer,
} = require("../controllers/volunteer");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(createVolunteer)
  .get(reqFilter, getVolunteer)
  .put(updateVolunteer)
  .delete(deleteVolunteer);

module.exports = router;
