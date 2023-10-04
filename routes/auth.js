const router = require("express").Router();
//
const { login, getMe, register } = require("../controllers/auth");
const { protect, authorize } = require("../middleware/auth");

router.post("/login", login);
router.post("/register", register);

router.get("/get-me", protect, getMe);

module.exports = router;
