const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/userController");

const { gatekeeper } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.get("/login", loginUser);
router.get("/profile", gatekeeper, getUserProfile);

module.exports = router;
