const router = require("express").Router();
// Controllers
const { getRegistration } = require("../controllers/pendingReg");
// Middleware
const { reqFilter } = require("../middleware/filter");

router.route("/").get(reqFilter, getRegistration);

module.exports = router;
