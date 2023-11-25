const router = require("express").Router();
// Controllers
const {
  createProgramLocation,
  getProgramLocation,
  updateProgramLocation,
  deleteProgramLocation,
  select,
  // getByFranchise,
} = require("../controllers/programLocation");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(createProgramLocation)
  .get(reqFilter, getProgramLocation)
  .put(updateProgramLocation)
  .delete(deleteProgramLocation);

router.get("/select", reqFilter, select);

module.exports = router;
