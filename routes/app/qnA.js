// module.exports = router;

const router = require("express").Router();
// Controllers
const {
  createQnA,
  getQnA,
  updateQnA,
  deleteQnA,
  select,
} = require("../../controllers/qnA");
// Middleware
const { protect, authorize } = require("../../middleware/auth");
const { reqFilter } = require("../../middleware/filter");

router
  .route("/")
  .post(createQnA)
  .get(reqFilter, getQnA)
  .put(updateQnA)
  .delete(deleteQnA);

router.get("/select", reqFilter, select);

module.exports = router;
