const express = require("express");
const {
  createGroup,
  getMyGroups,
  getGroupById,
} = require("../controllers/group.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, createGroup);
router.get("/", authMiddleware, getMyGroups);
router.get("/:groupId", authMiddleware, getGroupById);

module.exports = router;
