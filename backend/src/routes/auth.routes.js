const express = require("express");
const { registerUser, loginUser } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// register route
router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Protected route accessed",
    user: req.user,
  });
});

module.exports = router;
