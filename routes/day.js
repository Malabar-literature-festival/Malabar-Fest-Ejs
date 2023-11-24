const router = require("express").Router();
// Controllers
const {
    createDay,
    getDay,
    updateDay,
    deleteDay,
    select,
} = require("../controllers/day");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
    .route("/")
    .post(createDay)
    .get(reqFilter, getDay)
    .put(updateDay)
    .delete(deleteDay);

router.get("/select", reqFilter, select);

module.exports = router;