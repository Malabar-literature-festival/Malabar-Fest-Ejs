const router = require("express").Router();
// Controllers
const {
  createSession,
  getSession,
  updateSession,
  deleteSession,
  select,
  getSessionByDay,
} = require("../controllers/session");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");

router
  .route("/")
  .post(createSession)
  .get(reqFilter, getSession)
  .put(updateSession)
  .delete(deleteSession);

router.get("/select", reqFilter, select);
router.get("/session-by-day", reqFilter, getSessionByDay);

module.exports = router;