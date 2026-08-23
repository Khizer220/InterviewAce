const express = require("express");

const {
  getCodingProblems,
  getCodingProblem,
  createCodingProblem,
  updateCodingProblem,
  deleteCodingProblem,
  updateCodingProblemStatus,
  getCodingStatistics,
  generateCodingProblemsWithAI,
} = require("../controllers/codingController");

const router = express.Router();

// ======================================
// CODING STATISTICS
// ======================================

router.get("/statistics", getCodingStatistics);

// ======================================
// CODING PROBLEMS
// ======================================

router.post(
  "/generate",
  generateCodingProblemsWithAI
);
router.get("/", getCodingProblems);


router.get("/:id", getCodingProblem);

router.post("/", createCodingProblem);

router.patch("/:id", updateCodingProblem);

router.patch("/:id/status", updateCodingProblemStatus);

router.delete("/:id", deleteCodingProblem);

module.exports = router;