const router = require("express").Router();
// Controllers
const {
    getApproved,
} = require("../controllers/approval");
// Middleware
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .get(reqFilter, getApproved)
module.exports = router;
