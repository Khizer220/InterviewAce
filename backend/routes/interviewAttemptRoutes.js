const express = require("express");

const router = express.Router();

const {
  createInterviewAttempt,
  getCandidateAttempts,
  getInterviewAttempt,
} = require("../controllers/interviewAttemptController");

// Submit Interview
router.post("/", createInterviewAttempt);

// Get Candidate Attempts
router.get("/candidate/:id", getCandidateAttempts);

// Get Single Attempt
router.get("/:id", getInterviewAttempt);

module.exports = router;