const express = require("express");
const requireAuth = require("../middleware/authMiddleware");
const { getLibrary, replaceLibrary } = require("../controllers/bookController");

const router = express.Router();
router.use(requireAuth);
router.get("/", getLibrary);
router.put("/", replaceLibrary);
module.exports = router;
