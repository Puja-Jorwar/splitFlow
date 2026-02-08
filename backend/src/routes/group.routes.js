const express = require("express");
const { createGroup, getMyGroups } = require("../controllers/group.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, createGroup);
router.get("/", authMiddleware, getMyGroups);

module.exports = router;
