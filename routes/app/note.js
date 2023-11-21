// module.exports = router;

const router = require("express").Router();
// Controllers
const {
  createNote,
  getNote,
  updateNote,
  deleteNote,
  select,
  // getByFranchise,
} = require("../../controllers/note");
// Middleware
const { protect, authorize } = require("../../middleware/auth");
const { reqFilter } = require("../../middleware/filter");

router
  .route("/")
  .post(createNote)
  .get(reqFilter, getNote)
  .put(updateNote)
  .delete(deleteNote);

router.get("/select", reqFilter, select);

module.exports = router;
