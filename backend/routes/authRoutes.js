const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// ===============================
// Public Routes
// ===============================

router.post("/register", registerUser);

router.post("/login", loginUser);

// ===============================
// Protected Profile Routes
// ===============================

router.get(
  "/profile",
  protect,
  getProfile
);

router.put(
  "/profile",
  protect,
  updateProfile
);

module.exports = router;