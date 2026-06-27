const express = require("express");
const { registerUser, loginUser, getMe, updateMe } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// register route
router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", authMiddleware, getMe);
router.put("/me", authMiddleware, updateMe);

module.exports = router;
