const express = require("express");

const router = express.Router();

const {
  getInterviewTemplates,
  getInterviewTemplate,
  getCandidateInterviews,
  createInterviewTemplate,
  updateInterviewTemplate,
  deleteInterviewTemplate,
  toggleInterviewStatus,
  duplicateInterviewTemplate,
} = require("../controllers/interviewTemplateController");

// ======================================
// Candidate - Get Active Interviews
// IMPORTANT: Must come before /:id
// ======================================
router.get(
  "/candidate",
  getCandidateInterviews
);

// ======================================
// Admin - Get All Templates
// ======================================
router.get(
  "/",
  getInterviewTemplates
);

// ======================================
// Get Single Template
// ======================================
router.get(
  "/:id",
  getInterviewTemplate
);

// ======================================
// Create Template
// ======================================
router.post(
  "/",
  createInterviewTemplate
);

// ======================================
// Update Template
// ======================================
router.put(
  "/:id",
  updateInterviewTemplate
);

// ======================================
// Delete Template
// ======================================
router.delete(
  "/:id",
  deleteInterviewTemplate
);

// ======================================
// Toggle Status
// ======================================
router.patch(
  "/:id/status",
  toggleInterviewStatus
);

// ======================================
// Duplicate Template
// ======================================
router.post(
  "/:id/duplicate",
  duplicateInterviewTemplate
);

module.exports = router;