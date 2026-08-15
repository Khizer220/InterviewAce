const express = require("express");

const router = express.Router();

const {
  getUsers,
  getPendingUsers,
  approveUser,
  rejectUser,
  deleteUser,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");

// ======================================
// Admin Authorization Middleware
// ======================================

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Administrator access required",
    });
  }

  next();
};

// ======================================
// Apply Authentication + Admin Check
// ======================================

router.use(protect);
router.use(adminOnly);

// ======================================
// Pending Candidates
// ======================================
router.get("/users", getUsers);
router.get("/users/pending", getPendingUsers);

// ======================================
// Approve Candidate
// ======================================

router.patch(
  "/users/:id/approve",
  approveUser
);

// ======================================
// Reject Candidate
// ======================================

router.patch(
  "/users/:id/reject",
  rejectUser
);

// ======================================
// Remove Candidate
// ======================================

router.delete(
  "/users/:id",
  deleteUser
);
module.exports = router;