const router = require("express").Router();
// Controllers
const {
    createRegistration,
    getRegistration,
    updateRegistration,
    deleteRegistration,
} = require("../controllers/registration");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
    .route("/")
    .post(
        getUploadMiddleware("uploads/registration", ["image"]),
        getS3Middleware(["image"]),
        createRegistration
    )
    .get(reqFilter, getRegistration)
    .put(
        getUploadMiddleware("uploads/registration", ["image"]),
        getS3Middleware(["image"]), updateRegistration
    )
    .delete(deleteRegistration);

module.exports = router;
