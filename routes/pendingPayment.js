const router = require("express").Router();
// Controllers
const {
  getPendingPayment,
} = require("../controllers/pendingPayment");
// Middleware
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .get(reqFilter, getPendingPayment)
module.exports = router;
