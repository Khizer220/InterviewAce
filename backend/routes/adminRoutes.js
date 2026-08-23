const express = require("express");
const router = express.Router();

const {
  getUsers,
  getPendingUsers,
  approveUser,
  rejectUser,
  deleteUser,
  updateUserStack,
  getCandidateInterviews,
  getAnalytics,
  getResumes,
  getDashboardOverview,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Administrator access required",
    });
  }

  next();
};

router.use(protect);
router.use(adminOnly);

router.get("/users", getUsers);

router.get("/users/pending", getPendingUsers);

router.patch("/users/:id/approve", approveUser);

router.patch("/users/:id/reject", rejectUser);

router.patch("/users/:id/stack", updateUserStack);

router.get("/users/:id/interviews", getCandidateInterviews);

router.get("/analytics", getAnalytics);

router.get("/resumes", getResumes);

router.get("/dashboard-overview", getDashboardOverview);

router.delete("/users/:id", deleteUser);

module.exports = router;