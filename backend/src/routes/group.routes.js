const express = require("express");
const {
  createGroup,
  getMyGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  addMember,
  removeMember,
  getGroupBalances,
} = require("../controllers/group.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", createGroup);
router.get("/", getMyGroups);
router.get("/:groupId", getGroupById);
router.put("/:groupId", updateGroup);
router.delete("/:groupId", deleteGroup);

router.post("/:groupId/members", addMember);
router.delete("/:groupId/members/:memberId", removeMember);
router.get("/:groupId/balances", getGroupBalances);

module.exports = router;
