const router = require("express").Router();
const { aiask } = require("../controllers/aiBot");
//controllers
//middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
    .route("/")
    .post(protect, aiask)

module.exports = router;
