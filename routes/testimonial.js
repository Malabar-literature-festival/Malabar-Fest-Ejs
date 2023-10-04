const router = require("express").Router();
// Controllers
const {
    createTestimonial,
    getTestimonial,
    updateTestimonial,
    deleteTestimonial,
    // getByFranchise,
} = require("../controllers/testimonial");
// Middleware
const { protect, authorize } = require("../middleware/auth");
const { reqFilter } = require("../middleware/filter");
const { getS3Middleware } = require("../middleware/s3client");
const getUploadMiddleware = require("../middleware/upload");

router
    .route("/")
    .post(
        getUploadMiddleware("uploads/testimonial", ["image"]),
        getS3Middleware(["image"]),
        createTestimonial
    )
    .get(reqFilter, getTestimonial)
    .put(
        getUploadMiddleware("uploads/testimonial", ["image"]),
        getS3Middleware(["image"]), updateTestimonial
    )
    .delete(deleteTestimonial);

module.exports = router;
