// module.exports = router;

const router = require("express").Router();
// Controllers
const {
  createQna,
  getQna,
  updateQna,
  deleteQna,
  select,
  // getByFranchise,
} = require("../../controllers/QnA");
// Middleware
const { protect, authorize } = require("../../middleware/auth");
const { reqFilter } = require("../../middleware/filter");

router
  .route("/")
  .post(createQna)
  .get(reqFilter, getQna)
  .put(updateQna)
  .delete(deleteQna);

router.get("/select", reqFilter, select);

module.exports = router;
