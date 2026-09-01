const express = require("express");
const router = express.Router();

const {
  createInterviewAttempt,
  getCandidateAttempts,
  getMyAttempts,
  getInterviewAttempt,
} = require("../controllers/interviewAttemptController");

const { protect } = require("../middleware/authMiddleware");

// ======================================
// Submit Interview
// ======================================
router.post("/", protect, createInterviewAttempt);

// ======================================
// Get Logged-in Candidate Attempts
// Used by Performance page
// ======================================
router.get("/my", protect, getMyAttempts);

// ======================================
// Get Candidate Attempts
// ======================================
router.get("/candidate/:id", protect, getCandidateAttempts);

// ======================================
// Get Single Attempt
// ======================================
router.get("/:id", protect, getInterviewAttempt);

module.exports = router;