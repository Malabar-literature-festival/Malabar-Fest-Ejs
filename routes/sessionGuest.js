const router = require("express").Router();
// Controllers
const {
  createSessionGuest,
  getSessionGuest,
  updateSessionGuest,
  deleteSessionGuest,
  select,
  getSessionGuestBySession,
} = require("../controllers/sessionGuest");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
  .route("/")
  .post(
    getUploadMiddleware("uploads/sessionGuest", ["photo"]),
    getS3Middleware(["photo"]),
    createSessionGuest
  )
  .get(reqFilter, getSessionGuest)
  .put(
    getUploadMiddleware("uploads/sessionGuest", ["photo"]),
    getS3Middleware(["photo"]),
    updateSessionGuest
  )
  .delete(deleteSessionGuest);

router.get("/select", reqFilter, select);
router.get("/sessionguest-by-session", reqFilter, getSessionGuestBySession);

module.exports = router;