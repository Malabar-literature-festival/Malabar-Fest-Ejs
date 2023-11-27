const router = require("express").Router();
// Controllers
const {
    createSpeakers,
    getSpeakers,
    updateSpeakers,
    deleteSpeakers,
    select,
} = require("../controllers/speakers");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
    .route("/")
    .post(
        getUploadMiddleware("uploads/speakers", ["image"]),
        getS3Middleware(["image"]),
        createSpeakers
    )
    .get(reqFilter, getSpeakers)
    .put(
        getUploadMiddleware("uploads/speakers", ["image"]),
        getS3Middleware(["image"]), updateSpeakers
    )
    .delete(deleteSpeakers);
    router.get("/select", reqFilter, select);

module.exports = router;
